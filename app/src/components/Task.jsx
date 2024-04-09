import { Button, Container } from '../library'

import { useContext } from '../hooks'

import logic from '../logic'
import helper from '../logic/helpers'

function Task(props) {
    const task = props.task
    const profile = props.profile
    const assigneeName = props.profileName

    const context = useContext()

    const handleTaskClick = () => {
        props.onTaskClick(task)
    }

    return <Container className='relative'>
        <Button className='absolute top-[30%] left-3 text-lg'>{task.date.split('-')[2].split('T')[0]}</Button>

        <Button onClick={handleTaskClick} style={{ backgroundColor: task.date < props.today ? '#9fa0a469' : '' }} className='flex flex-col justify-center items-center border-2 border-slate-300 p-2 w-[100%] text-lg h-[5rem]'>
            <div className='grid grid-cols-3'>
                <div className={`flex flex-col items-center justify-center ${task.done === false && task.delay === 0 ? 'col-span-3' : 'col-span-2'}`}>
                    <p>{helper.arrangeText(task.template.name)}</p>
                    <p>{assigneeName}</p>
                </div>

                <div className='col-span-1 flex items-center justify-end'>
                    {task.done && <p>Completed</p>}
                    {task.delay !== 0 && `${task.delay} delays`}
                </div>
            </div>
        </Button>

        <Button style={{ backgroundColor: task.done === true ? '#3BB14399' : profile ? `${profile.color.code}` : '' }} className='absolute w-7 h-[5rem] top-[0rem] right-[0rem] text-lg'></Button>
    </Container>
}

export default Task