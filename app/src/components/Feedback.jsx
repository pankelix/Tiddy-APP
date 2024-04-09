import { Container, Button } from '../library'
import classnames from 'classnames'

const Feedback = props => {
    let modifier = 'Feedback--debug'

    switch (props.level) {
        case 'warn':
            modifier = 'Feedback--warn'
            break
        case 'error':
            modifier = 'Feedback--error'
            break
        case 'fatal':
            modifier = 'Feedback--fatal'
            break
        default:
            modifier = 'Feedback--info'
            break
    }

    return <Container className={`Feedback fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
        <article className={`${modifier} w-[90%] rounded-lg shadow-md pt-[1.2rem] rounded-lg shadow-md text-center`}>
            <div className='modal-border-button-container flex items-center'>
                <p className='text-lg text-black mb-4'>{props.message}</p>
                <Button onClick={props.onAccepted} className='bg-white text-black px-4 py-2 rounded-lg'>Accept</Button>
            </div>
        </article>
    </Container>
}

export default Feedback