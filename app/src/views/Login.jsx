import logic from '../logic'

import { Container, Form, Input, Button, Link } from '../library'
import { useContext } from '../hooks'

function Login(props) {
    /* console.log('login') */

    const context = useContext()

    const handleSubmit = async event => {
        event.preventDefault()

        const email = event.target.querySelector('#email-input').value
        const password = event.target.querySelector('#password-input').value

        try {
            await logic.loginHome(email, password)
            props.onSuccess()
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleRegisterClick = (event) => {
        event.preventDefault()
        props.onRegisterClick()
    }

    return <Container className='flex items-center justify-center gap-[25px] h-screen'>
        <article className='box-border bg-white rounded-lg w-screen h-[760px] px-[30px] py-[70px] flex flex-col items-center gap-[10px] shadow-lg shadow-slate-200'>
            <Form onSubmit={handleSubmit} className='select-none h-[38px] w-[360px] flex flex-col items-center gap-[10px] relative top-[10rem]'>

                <h1 className='text-4xl font-semibold mb-[1rem]'>Login</h1>

                <Input id='email-input' type='email' placeholder='Email' className='entrance-input'>Email</Input>

                <Input id='password-input' type='password' placeholder='Password' className='entrance-input'>Password</Input>

                <Button type='submit' className='cursor-pointer p-[1.8rem] border-none rounded-md text-lg text-white bg-amber-400 absolute top-[17rem] w-[216px] h-[30px] flex justify-center items-center'>Log In</Button>
            </Form>

            <nav className='text-sm flex justify-center gap-4 absolute bottom-[12rem] w-[100%] font-'>
                <p>Don't have an account?</p>
                <Link onClick={handleRegisterClick}>Create new account</Link>
            </nav>
        </article>
    </Container>
}

export default Login