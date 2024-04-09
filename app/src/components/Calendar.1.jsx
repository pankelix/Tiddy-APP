import { useNavigate } from 'react-router-dom'

import { format, addDay, weekStart, weekEnd, dayEnd } from '@formkit/tempo'

import session from '../logic/session'
import logic from '../logic'
import helpers from '../logic/helpers'

import { useContext } from '../hooks'

import { useState, useEffect } from 'react'
import { Container, Button, Form, Input, Label } from '../library'

import { Task, EmptyDate } from '.'

function Calendar(props) {
    /* console.log('Calendar') */

    const context = useContext()
    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])
    const [reversed, setReversed] = useState(false)
    const [today, setToday] = useState(null)
    const [buttonDate, setButtonDate] = useState(null)
    const [week, setWeek] = useState(0)
    const [task, setTask] = useState(null)
    const [profiles, setProfiles] = useState([])
    const [assignedId, setAssignedId] = useState(null)
    const [chosenTemplate, setChosenTemplate] = useState(null)
    const [templates, setTemplates] = useState([])
    const [onlyMine, setOnlyMine] = useState(false)
    const [view, setView] = useState(null)

    const retrieveAssignee = async () => {
        try {
            const profiles = await logic.retrieveProfiles()
            setProfiles(profiles)
        } catch (error) {
            context.handleError(error)
        }
    }

    const refreshTemplates = async () => {
        try {
            const templates = await logic.retrieveTemplates()

            setTemplates(templates)
        } catch (error) {
            context.handleError(error)
        }
    }

    const refreshToday = () => {
        setToday(new Date().toISOString().split('T')[0])
    }

    const refreshTasks = async () => {
        try {
            let tasks
            if (onlyMine === false)
                tasks = await logic.retrieveTasks(week)
            else if (onlyMine === true)
                tasks = await logic.retrieveProfileTasks(week)

            const tasks2 = []

            const currentDate = addDay(new Date(), week * 7)
            const startOfCurrentWeek = dayEnd(weekStart(currentDate, 1))

            if (tasks.length === 0) {
                for (let j = 0; j < 7; j++) {
                    tasks2.push({ date: format(addDay(startOfCurrentWeek, j), 'DD-MM-YYYY')/* .slice(0, 5).replace('-', ' ') */ })
                }

            } else {
                const firstTaskDate = new Date(tasks[0].date)
                const firstPartOfWeekInms = firstTaskDate - startOfCurrentWeek
                const firstPartOfWeek = Math.ceil(firstPartOfWeekInms / (1000 * 60 * 60 * 24))

                for (let j = 0; j < firstPartOfWeek; j++) {
                    tasks2.push({ date: format(addDay(startOfCurrentWeek, j), 'DD-MM-YYYY')/* .slice(0, 5).replace('-', ' ') */ })
                }

                for (let i = 0; i < tasks.length - 1; i++) {
                    const startDate = new Date(tasks[i].date)
                    const endDate = new Date(tasks[i + 1].date)
                    const msDifference = endDate - startDate
                    const daysDifference = Math.floor(msDifference / (1000 * 60 * 60 * 24))

                    tasks2.push(tasks[i])
                    for (let j = 0; j < daysDifference - 1; j++) {
                        tasks2.push({ date: format(addDay(tasks[i].date, j + 1), 'DD-MM-YYYY')/* .slice(5).replace('-', ' ') */ })
                        /* const originalDate = tasks[i].date
                        const objectDate = new Date(originalDate)
                        objectDate.setDate(objectDate.getDate() + j)
                        const newDate = objectDate.toISOString().split('T')[0]
                        tasks2.push({ date: newDate }) */
                    }
                }
                tasks2.push(tasks[tasks.length - 1])

                const endOfCurrentWeek = dayEnd(weekEnd(currentDate, 1))
                const lastTaskDate = new Date(tasks[tasks.length - 1].date)
                const lastPartOfWeekInms = endOfCurrentWeek - lastTaskDate
                const lastPartOfWeek = Math.ceil(lastPartOfWeekInms / (1000 * 60 * 60 * 24))

                for (let k = 0; k < lastPartOfWeek; k++) {
                    tasks2.push({ date: format(addDay(lastTaskDate, k + 1), 'DD-MM-YYYY')/* .slice(0, 5).replace('-', ' ') */ })
                }
            }
            setTasks(tasks2)
        } catch (error) {
            context.handleError(error)
        }
    }

    useEffect(() => {
        /* console.log('Tasks/Profiles effect') */

        refreshToday()
        retrieveAssignee()
        refreshTasks()
        refreshTemplates()
    }, [props.stamp, week, onlyMine])

    const handleOnTaskClick = (task) => {
        if (onlyMine === true || task.done === true)
            return

        const dateString = task.date.split('T')[0]
        const dateParts = dateString.split('-')
        const formatDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`)
        const finalDate = formatDate.toISOString().split('T')[0]

        setButtonDate(finalDate)

        setTask(task)
        setView('react-to-task-view')
    }

    const handleCancelClick = () => {
        setView(null)
        setButtonDate(null)
        setChosenTemplate(null)
    }

    const handleNewProposalClick = () => {
        setView('new-task-view')
    }

    const handleNewTaskClick = () => {
        navigate('/templates')
    }

    const handleProposeTaskClick = (taskDate) => {
        if (session.profileRole === null)
            return

        if (typeof taskDate === 'string') {
            const dateParts = taskDate.split('-')
            const formatDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
            const finalDate = formatDate.toISOString().split('T')[0]

            setButtonDate(finalDate)

            if (finalDate < today)
                return
        }

        setView('propose-task')
    }

    const handleProposeTaskSubmit = async (event) => {
        event.preventDefault()
        const date = event.target.date.value
        /* const dateObject = date ? new Date(date) : null */
        try {
            await logic.createTask(chosenTemplate, date ? date : buttonDate)
            refreshTasks()
            setChosenTemplate(null)
            setView(null)
        } catch (error) {
            context.handleError(error)
        }

    }

    const handleTakeThisTask = async () => {
        let materializedTaskId
        if (task.id.includes('_')) {
            try {
                materializedTaskId = await logic.materializeTask(task)
            } catch (error) {
                context.handleError(error)
            }
        }

        try {
            await logic.takeTask(materializedTaskId ? materializedTaskId : task.id)
            refreshTasks()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleAssignThisTaskClick = () => {
        setView('assign-task-view')
    }

    const handleAssignedClick = (profileId) => {
        setAssignedId(profileId)
    }

    const handleAssignThisTask = async () => {
        let materializedTaskId
        if (task.id.includes('_')) {
            try {
                materializedTaskId = await logic.materializeTask(task)
            } catch (error) {
                context.handleError(error)
            }
        }

        try {
            await logic.assignTask(materializedTaskId ? materializedTaskId : task.id, assignedId)
            refreshTasks()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleDelayTaskClick = () => {
        setView('delay-task-view')
    }

    const handleDelaySubmit = async (event) => {
        event.preventDefault()
        const date = event.target.delayDate.value
        try {
            await logic.delayTask(task.id, date)
            refreshTasks()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleDeleteClick = async () => {
        if (confirm("Are you sure you want to delete this task? You'll delete all tasks like this one"))
            try {
                await logic.deleteTask(task.id)
                refreshTasks()
                setView(null)
            } catch (error) {
                context.handleError(error)
            }
    }

    const handleCompleteTaskClick = () => {
        setView('pin-code-view')
    }

    const handleCompleteSubmit = async (event) => {
        event.preventDefault()
        const date = event.target.completionDate.value

        /* let materializedTaskId
        if (task.id.includes('_')) {
            try {
                materializedTaskId = await logic.materializeTask(task, date)
            } catch (error) {
                context.handleError(error)
            }
        } */

        let digit1 = event.target.digit1.value
        let digit2 = event.target.digit2.value
        let digit3 = event.target.digit3.value
        let digit4 = event.target.digit4.value

        let pincode = digit1 + digit2 + digit3 + digit4

        try {
            await logic.completeTask(/* materializedTaskId ? materializedTaskId :  */task.id, pincode, date)
            refreshTasks()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleArrangeTasksClick = () => {
        const reversedTasks = [...tasks].reverse()
        setTasks(reversedTasks)
        if (reversed === false) {
            setReversed(true)
        } else if (reversed === true)
            setReversed(false)
    }

    const handleShowOnlyMine = () => {
        setOnlyMine(!onlyMine)
    }

    const handleLastWeekClick = () => {
        setWeek(week - 1)
    }

    const handleNextWeekClick = () => {
        setWeek(week + 1)
    }

    return <Container className='px-[1rem] w-screen'>
        <article className='flex mb-[1rem] ml-[0.2rem] mt-[1rem]'>
            <Button onClick={handleArrangeTasksClick} className='text-2xl'>{reversed ? '▼' : '▲'}</Button>

            <aside className='ml-[14.5rem] mt-[0.3rem] gap-[1rem]'>
                {session.profileRole !== null && <Button onClick={handleShowOnlyMine}>Show: {onlyMine ? 'Mine' : 'All'}</Button>}
            </aside>
        </article>

        <article className='flex flex-col max-h-[33rem] overflow-y-auto'>
            <Button onClick={handleLastWeekClick} className='calendar-week-navigator'>▲</Button>

            {tasks.map(task => task.id ? <Task key={task.id} task={task} profile={profiles.find(profile => task.assignee === profile.id)} profileName={profiles.map(profile => task.assignee === profile.id ? profile.name : '')} onTaskClick={handleOnTaskClick} /> : <EmptyDate key={task.date} task={task} onTaskClick={(taskDate) => handleProposeTaskClick(taskDate)} today={today} />)}

            <Button onClick={handleNextWeekClick} className='calendar-week-navigator'>▼</Button>
        </article>

        {view === 'react-to-task-view' && session.profileRole !== null && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='flex gap-[0.7rem] mb-[1rem]'>
                    {session.profileRole === 'admin' && <h3 className='bg-amber-400 p-4 rounded-full font-bold text-lg'>{helpers.arrangeDate(task.date).split(' ')[0]}</h3>}
                    <div className='flex flex-col'>
                        {session.profileRole === 'admin' && <h3 className='font-bold text-lg'>{helpers.arrangeText(task.template.name)}</h3>}

                        {session.profileRole === 'admin' && (
                            <h3 className='text-lg' style={{ color: profiles.find(profile => profile.id === task.assignee)?.color?.code }}>
                                {profiles.map(profile => profile.id === task.assignee && profile.name)}
                            </h3>
                        )}
                    </div>
                </div>

                <div className='modal-border-button-container'>
                    {session.profileRole !== null && <Button onClick={handleTakeThisTask} className='modal-border-button'>Take this task</Button>}

                    {session.profileRole === 'admin' && <Button onClick={handleAssignThisTaskClick} className='modal-border-button'>Assign this task to...</Button>}

                    {session.profileRole !== null && <Button onClick={handleCompleteTaskClick} className='modal-border-button'>Complete this task</Button>}

                    {session.profileRole !== null && <Button onClick={handleDelayTaskClick} className='modal-border-button'>Delay this task</Button>}

                    {session.profileRole === 'admin' && <Button onClick={handleDeleteClick} className='modal-border-button'>Delete this task</Button>}
                </div>
                <div className='modal-close-button-container'>
                    {session.profileRole !== null && <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>}
                </div>
            </div>
        </article>}

        {view === 'assign-task-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container max-h-[15rem] overflow-y-auto'>
                    {profiles.map(profile => profile.id !== session.profileId ? <Form id='assign-task-form' key={profile.id} onSubmit={handleAssignThisTask}>
                        <Button type='button' style={{ borderWidth: assignedId === profile.id ? '3px' : '1px' }} onClick={() => handleAssignedClick(profile.id)} className='flex flex-col text-xl p-[1rem] modal-border-button'>{profile.name}</Button>
                    </Form> : '')}
                </div>
                <div className='close-submit-buttons-container'>
                    <Button form='assign-task-form' type='submit' className='form-submit-button'>Submit</Button>
                    {session.profileRole !== null && <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>}
                </div>
            </div>
        </article>}

        {view === 'pin-code-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleCompleteSubmit} id='complete-task-form'>
                        <div className='flex flex-col gap-[1rem] mb-[2rem]'>
                            <Label form='completionDate' className='font-bold'>Completion date</Label>
                            <Input max={today} id='completionDate' type={'date'} required={true} className='border-2 border-amber-400'></Input>
                        </div>

                        <div className='flex flex-col items-center mt-[2rem] gap-[1.5rem]'>
                            <p className='text-xl font-bold'>Pin Code</p>

                            <div className='flex gap-[1rem]'>
                                <Input type='number' min='0' max='9' id='digit1' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='digit2' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='digit3' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='digit4' placeholder='-' className='pincode-digit'></Input>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className='close-submit-buttons-container'>
                    <Button form='complete-task-form' type='submit' className='form-submit-button'>Submit</Button>

                    {session.profileRole !== null && <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>}
                </div>
            </div>
        </article>}

        {view === 'delay-task-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form id='delay-task-form' onSubmit={handleDelaySubmit}>
                        <Input id='delayDate' defaultValue={buttonDate} type={'date'} required={true} className='border-2 border-amber-400'></Input>
                    </Form>
                </div>

                <div className='close-submit-buttons-container'>
                    <Button form='delay-task-form' type='submit' value={task} className='form-submit-button'>Delay</Button>

                    {session.profileRole !== null && <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>}
                </div>
            </div>
        </article>}

        {view === 'new-task-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container'>
                    <Button onClick={handleNewTaskClick} className='modal-border-button'>Create new task</Button>

                    {templates.length > 0 ? <Button onClick={handleProposeTaskClick} className='modal-border-button'>Propose task</Button> : ''}

                </div>
                <div className='close-submit-buttons-container'>
                    <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        {view === 'propose-task' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container'>
                    {templates.length > 0 ? <Form id='propose-task' onSubmit={handleProposeTaskSubmit} className='flex flex-col items-center'>
                        <p className='text-xl mb-[2rem]'>Propose task</p>

                        <Input defaultValue={buttonDate} min={today} id='date' type={'date'} required={true} className='border-2 border-amber-400 mb-[1rem]'></Input>

                        <div className='modal-border-button-container max-h-[15rem] overflow-y-auto mb-[-1rem]'>
                            {templates.map(template => <Button style={{ borderWidth: chosenTemplate === template.id ? '3px' : '1px' }} onClick={() => setChosenTemplate(template.id)} key={template.id} name='template' type='button' value={template.id} className='border-amber-400 border-[1px] w-[14rem] px-3 rounded-md mx-[0.5rem]'>
                                {helpers.arrangeText(template.name)}
                            </Button>)}
                        </div>

                    </Form> : <h3>Please click on the + below to create a template</h3>}
                </div>

                <div className='close-submit-buttons-container'>
                    <Button form='propose-task' type='submit' className='form-submit-button'>Submit</Button>

                    {session.profileRole !== null && <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>}
                </div>
            </div>
        </article>}

        {session.profileRole !== null && <article>
            <Button onClick={handleNewProposalClick} className='plus-button'>
                ➕
            </Button>
        </article>}
    </Container >
}

export default Calendar