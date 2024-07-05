import logic from '../logic'

import { Container, Form, Input, Button, Link } from '../library'
import { useContext } from '../hooks'
import { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'

function Login(props) {
    const context = useContext()

    const [loading, setLoading] = useState(false)
    const [color, setColor] = useState('#fff')

    const handleSubmit = async event => {
        event.preventDefault()

        setLoading(true)

        const email = event.target.querySelector('#email-input').value
        const password = event.target.querySelector('#password-input').value

        try {
            await logic.loginHome(email, password)

            props.onSuccess()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            context.handleError(error)
        }
    }

    const handleRegisterClick = (event) => {
        event.preventDefault()
        props.onRegisterClick()
    }

    return <Container className='flex flex-col items-center justify-center h-screen lg:flex-row lg:gap-32'>
        <div className='flex flex-col items-center'>
            <h1 className='text-neutral-600 text-4xl font-semibold mb-[1rem]'>Login</h1>

            <div>
                <Form onSubmit={handleSubmit} className='select-none w-[360px] flex flex-col items-center gap-[10px]'>


                    <Input id='email-input' type='email' placeholder='Email' className='entrance-input'>Email</Input>

                    <Input id='password-input' type='password' placeholder='Password' className='entrance-input'>Password</Input>

                    <Button type='submit' className='flex items-center justify-center w-full py-3 text-lg text-white border-none rounded-md cursor-pointer px-28 bg-amber-400'>Log In</Button>
                </Form>
            </div>
        </div>

        <nav className='flex flex-col items-center gap-10 mt-20 text-sm text-center lg:mt-12'>
            <div className='flex gap-4 lg:flex-col lg:gap-0'>
                <p>Don't have an account?</p>
                <Link className='underline underline-offset-2' onClick={handleRegisterClick}>Create new account</Link>
            </div>
            <div className='flex flex-col gap-1'>
                <p className='pb-2'>Or use our demo account:</p>
                <p>Email: <strong>man@sion.com</strong></p>
                <p>Password: <strong>123123123</strong></p>
            </div>
        </nav>

        {loading ?
            <div className='absolute p-5 rounded-md w-72 bg-amber-400 top-70'>
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
            </div> : ''}
    </Container>
}

export default Login