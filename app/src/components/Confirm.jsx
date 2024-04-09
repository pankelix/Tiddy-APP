import { Container, Button } from '../library'
import classnames from 'classnames'

const Confirm = props => {/*
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
    } */

    return <Container className='bg-white fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
        <article className='bg-amber-400 w-[95%] rounded-lg shadow-md pt-[1.2rem] rounded-lg shadow-md text-center'>
            <div className='modal-border-button-container flex items-center'>
                <p className='text-lg font-bold text-black m-4'>{props.confirmMessage}</p>
                <div className='flex gap-[1.5rem]'>
                    <Button onClick={props.onAccepted} className='bg-white text-black px-4 py-2 rounded-lg'>Go on</Button>
                    <Button onClick={props.onCanceled} className='bg-white text-black px-4 py-2 rounded-lg'>Cancel</Button>
                </div>
            </div>
        </article>
    </Container>
}

export default Confirm