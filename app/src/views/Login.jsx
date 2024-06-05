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

    return <Container className='flex flex-col items-center justify-center'>

        <article className='box-border bg-white rounded-lg max-w-screen max-h-screen py-[70px] flex flex-col items-center gap-[10px] shadow-lg shadow-slate-200 h-screen'>
            <Form onSubmit={handleSubmit} className='select-none w-[360px] flex flex-col items-center gap-[10px]'>

                <h1 className='text-4xl font-semibold mb-[1rem]'>Login</h1>

                <Input id='email-input' type='email' placeholder='Email' className='entrance-input'>Email</Input>

                <Input id='password-input' type='password' placeholder='Password' className='entrance-input'>Password</Input>

                <Button type='submit' className='cursor-pointer mt-5 p-[1.8rem] border-none rounded-md text-lg text-white bg-amber-400 w-[216px] h-[30px] flex justify-center items-center'>Log In</Button>
            </Form>

            {loading ?
                <div className='absolute p-5 rounded-md w-72 bg-amber-400 top-60'>
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

            <nav className='text-sm flex justify-center gap-4 w-[100%] pt-20'>
                <p>Don't have an account?</p>
                <Link className='underline underline-offset-2' onClick={handleRegisterClick}>Create new account</Link>
            </nav>

            <div className='p-4 rounded-md mt-14 bg-amber-300'>
                <h4 className='font-semibold'>Demo account:</h4>
                <div>
                    <p>Email: man@sion.com</p>
                    <p>Password: 123123123</p>
                </div>
            </div>
        </article>
    </Container>
}

export default Login