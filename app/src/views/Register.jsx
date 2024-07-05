import logic from '../logic'

import { Container, Form, Link, Input, Button } from '../library'
import { useContext } from '../hooks'
import { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'

function Register(props) {
    const context = useContext()

    const [loading, setLoading] = useState(false)
    const [color, setColor] = useState('#fff')

    const handleSubmit = async event => {
        event.preventDefault()

        setLoading(true)

        const name = event.target.querySelector('#name-input').value
        const email = event.target.querySelector('#email-input').value
        const password = event.target.querySelector('#password-input').value

        try {
            await logic.registerHome(name, email, password)
            props.onSuccess()
            context.handleConfirm('Home registered', null)
            setLoading(false)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleLoginClick = (event) => {
        event.preventDefault()
        props.onLoginClick()
    }

    return <Container className='flex flex-col items-center justify-center h-screen lg:flex-row lg:gap-32'>
        <div className='flex flex-col items-center'>
            <h1 className='text-neutral-600 text-4xl font-semibold mb-[1rem]'>Register</h1>

            <div>
                <Form onSubmit={handleSubmit} className='select-none w-[360px] flex flex-col items-center gap-[10px]'>


                    <Input id='name-input' type='name' placeholder='House name' className='entrance-input'>House name</Input>

                    <Input id='email-input' type='email' placeholder='Email' className='entrance-input'>Email</Input>

                    <Input id='password-input' type='Password' placeholder='Password' className='entrance-input'>Password</Input>

                    <Button type='submit' className='flex items-center justify-center w-full py-3 text-lg text-white border-none rounded-md cursor-pointer px-28 bg-amber-400'>Register</Button>
                </Form>
            </div>

            <nav className='flex flex-col items-center gap-10 mt-20 text-sm text-center lg:mt-12'>
                <div className='flex gap-4'>
                    <p>Already have an account?</p>
                    <Link className='underline underline-offset-2' onClick={handleLoginClick}>Log in</Link>
                </div>
            </nav>
        </div>

        {loading
            ? <div className='absolute p-5 rounded-md w-72 bg-amber-400 top-70'>
                <p className='pb-4 font-bold text-center text-white'>Login may take up to 3 minutes, because the server has to initialize. After that it'll be faster.</p>

                <div className='flex justify-center'>
                    <ClipLoader
                        color={color}
                        loading={loading}
                        size={100}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </div>
            : ''}
    </Container>
}

export default Register