import { Button, Container } from '../library'

import { useContext } from '../hooks'

import { format } from '@formkit/tempo'
import logic from '../logic'
import helper from '../logic/helpers'

function EmptyDate(props) {
    const task = props.task
    /* const profile = props.profile
    const assigneeName = props.profileName

    const context = useContext()
*/
    const handleTaskClick = () => {
        props.onTaskClick(task.date)
    }

    return <Container className='relative'>
        <Button className='absolute top-[20%] left-3 text-lg'>{task.date.split('-')[2]}</Button>

        <Button onClick={handleTaskClick} key={task.date} className='border-2 border-slate-300 p-0 my-2 w-[100%] text-lg'><p style={{ backgroundColor: task.date < props.today ? '#9fa0a469' : '' }} className='text-slate-400'>No tasks yet</p></Button>
    </Container>
}

export default EmptyDate