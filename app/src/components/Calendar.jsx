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
        setToday(format(new Date(), 'YYYY-MM-DD'))
    }

    const refreshTasks = async () => {
        try {
            // Elegir entre mostrar todas las tareas o solo las del profile activo
            let tasks
            if (onlyMine === false)
                tasks = await logic.retrieveTasks(week)
            else if (onlyMine === true)
                tasks = await logic.retrieveProfileTasks(week)

            const tasks2 = []

            // Calcular el principio de la semana
            const currentDate = addDay(new Date(), week * 7)
            const startOfCurrentWeek = dayEnd(weekStart(currentDate, 1))

            // En caso de no encontrar ninguna tarea en la semana
            if (tasks.length === 0) {
                for (let j = 0; j < 7; j++) {
                    tasks2.push({ date: format(addDay(startOfCurrentWeek, j), 'YYYY-MM-DD') })
                }

            } else {
                // Desde el inicio de la semana hasta la primera task
                const firstTaskDate = new Date(tasks[0].date)
                const firstPartOfWeekInMs = firstTaskDate - startOfCurrentWeek
                const firstPartOfWeekInDays = Math.ceil(firstPartOfWeekInMs / (1000 * 60 * 60 * 24))

                for (let j = 0; j < firstPartOfWeekInDays; j++) {
                    tasks2.push({ date: format(addDay(startOfCurrentWeek, j), 'YYYY-MM-DD') })
                }

                // Desde la primera task hasta la última task
                for (let i = 0; i < tasks.length - 1; i++) {
                    const startDate = new Date(tasks[i].date)
                    const nextDate = new Date(tasks[i + 1].date)
                    const differenceInMs = nextDate - startDate
                    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24))

                    // Control de materializaciones. Si una misma tarea tiene un oldId que coincide con su id actual O si una tarea está atrasada y tasks2 no es una fecha vacía
                    if ((tasks[i].oldId && tasks[i].oldId.split('_')[0] === tasks[i].id) || (tasks[i].delay > 0 && tasks2[i + 1] && tasks2[i + 1].home)) {
                        tasks2.splice(tasks2.length - 1, 1, tasks[i])
                    } else {
                        tasks2.push(tasks[i])
                    }

                    // Fechas vacías entre la primera y la última task
                    for (let j = 0; j < differenceInDays - 1; j++) {
                        tasks2.push({ date: format(addDay(tasks[i].date, j + 1), 'YYYY-MM-DD') })
                        /* const originalDate = tasks[i].date
                        const objectDate = new Date(originalDate)
                        objectDate.setDate(objectDate.getDate() + j)
                        const newDate = objectDate.toISOString().split('T')[0]
                        tasks2.push({ date: newDate }) */
                    }
                }

                // Si la tarea tiene delay, busco la misma tarea que ya esté esa semana y la sustituyo por fecha vacía, para evitar duplicaciones
                if (tasks[tasks.length - 1].delay > 0) {
                    const lastIndexOfEcho = tasks2.findLastIndex(task => task.home ? task.template._id === tasks[tasks.length - 1].template._id : 1 === 2)
                    if (lastIndexOfEcho >= 0)
                        tasks2.splice(lastIndexOfEcho, 1, { date: format(addDay(tasks2[tasks2.length - 1].date, 0), 'YYYY-MM-DD') })
                }

                // Mismo control de antes de materializaciones. Si una misma tarea tiene un oldId que coincide con su id actual O si una tarea está atrasada y tasks2 no es una fecha vacía
                if ((tasks[tasks.length - 1].oldId && tasks[tasks.length - 1].oldId.split('_')[0] === tasks[tasks.length - 1].id) || (tasks[tasks.length - 1].delay > 0 && tasks2[tasks.length - 1] && tasks2[tasks.length - 1].home)) {
                    tasks2.splice(tasks2.length - 1, 1, tasks[tasks.length - 1])
                } else {
                    tasks2.push(tasks[tasks.length - 1])
                }

                // Fechas vacías entre la última tarea y el final de la semana
                const endOfCurrentWeek = dayEnd(weekEnd(currentDate, 1))
                const lastTaskDate = new Date(tasks[tasks.length - 1].date)
                const lastPartOfWeekInMs = endOfCurrentWeek - lastTaskDate
                const lastPartOfWeekInDays = Math.ceil(lastPartOfWeekInMs / (1000 * 60 * 60 * 24))

                for (let k = 0; k < lastPartOfWeekInDays; k++) {
                    tasks2.push({ date: format(addDay(lastTaskDate, k + 1), 'YYYY-MM-DD') })
                }
            }

            // Para evitar duplicidades en la asignación de tareas. Si dos tareas tienen el mismo oldId, eliminar el primero de ellos
            for (let i = 0; i < tasks2.length; i++) {
                if (tasks2[i].id) {
                    const currentId = tasks2[i].id
                    for (let j = i + 1; j < tasks2.length; j++) {
                        if (tasks2[j].oldId === currentId) {
                            // Eliminar el primer objeto duplicado
                            tasks2.splice(i, 1)
                        }
                    }
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

        if (task.date < today)
            return

        const taskDate = format(task.date, 'YYYY-MM-DD')

        setButtonDate(taskDate)

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
        props.onCreateNewTask()
    }

    const handleProposeTaskClick = (taskDate) => {
        if (session.profileRole === null)
            return

        if (templates.length < 1)
            return

        if (typeof taskDate === 'string') {
            setButtonDate(taskDate)

            if (taskDate < today)
                return
        }

        setView('propose-task')
    }

    const handleProposeTaskSubmit = async (event) => {
        event.preventDefault()
        const date = event.target.date.value

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
        if (profiles.length <= 1)
            return

        setView('assign-task-view')
    }

    const handleAssignedClick = (profileId) => {
        setAssignedId(profileId)
    }

    const handleAssignThisTask = async (event) => {
        event.preventDefault()
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

        let materializedTaskId
        if (task.id.includes('_')) {
            try {
                materializedTaskId = await logic.materializeTask(task)
            } catch (error) {
                context.handleError(error)
            }
        }

        const date = event.target.delayDate.value
        try {
            await logic.delayTask(materializedTaskId ? materializedTaskId : task.id, date)
            refreshTasks()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleDeleteClick = async () => {
        context.handleConfirm("Are you sure you want to delete this task? You'll delete all tasks like this one", 'deleteTask')
    }

    useEffect(() => {
        const deleteTask = async () => {
            try {
                if (props.confirm && props.confirmAction === 'deleteTask') {
                    await logic.deleteTask(task.id)
                    refreshTasks()
                    setView(null)

                }
            } catch (error) {
                context.handleError(error)
            }
            props.onDeletion()
        }

        deleteTask()
    }, [props.confirm])

    const handleCompleteTaskClick = () => {
        if (format(task.date, 'YYYY-MM-DD') > today)
            return

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

            {tasks.map(task => task.id ? <Task key={task.id} task={task} profile={profiles.find(profile => task.assignee === profile.id)} profileName={profiles.map(profile => task.assignee === profile.id ? profile.name : '')} onTaskClick={(task) => handleOnTaskClick(task)} today={today} /> : <EmptyDate key={task.date} task={task} onTaskClick={(taskDate) => handleProposeTaskClick(taskDate)} today={today} />)}

            <Button onClick={handleNextWeekClick} className='calendar-week-navigator'>▼</Button>
        </article>

        <article className='flex mb-[1rem] ml-[0.2rem]'>
            {templates.length < 1 && <h3 key={'calendar-message'} className='font-bold text-xl mt-[2rem]'>Please, create a template before creating a task</h3>}
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

                    {session.profileRole === 'admin' && <Button style={{ borderColor: profiles.length <= 1 ? 'grey' : '', color: profiles.length <= 1 ? 'grey' : '' }} onClick={handleAssignThisTaskClick} className='modal-border-button'>Assign this task to...</Button>}

                    {session.profileRole !== null && <Button onClick={handleCompleteTaskClick} style={{ color: format(task.date, 'YYYY-MM-DD') > today ? 'grey' : '', borderColor: format(task.date, 'YYYY-MM-DD') > today ? 'grey' : '' }} className='modal-border-button'>Complete this task</Button>}

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
                        <Input id='delayDate' min={buttonDate} defaultValue={buttonDate} type={'date'} required={true} className='border-2 border-amber-400'></Input>
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

                        <Input defaultValue={buttonDate} min={buttonDate} id='date' type={'date'} required={true} className='border-2 border-amber-400 mb-[1rem]'></Input>

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