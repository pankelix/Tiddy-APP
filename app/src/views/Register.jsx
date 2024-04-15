import { useContext } from '../hooks'

import { Container, Form, Link, Input, Button } from '../library'

import logic from '../logic'

function Register(props) {
    /* console.log('register') */

    const context = useContext()

    const handleSubmit = async event => {
        event.preventDefault()

        const name = event.target.querySelector('#name-input').value
        const email = event.target.querySelector('#email-input').value
        const password = event.target.querySelector('#password-input').value

        try {
            await logic.registerHome(name, email, password)
            props.onSuccess()
            context.handleConfirm('Home registered', null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleLoginClick = (event) => {
        event.preventDefault()
        props.onLoginClick()
    }

    return <Container className='flex items-center justify-center '>
        <article className='box-border bg-white rounded-lg max-w-screen-md py-[70px] flex flex-col items-center gap-[10px] shadow-lg shadow-slate-200 h-screen'>
            <Form onSubmit={handleSubmit} className='select-none w-[360px] flex flex-col items-center gap-[10px]'>

                <h1 className='text-4xl font-semibold mb-[1rem]'>Register</h1>

                <Input id='name-input' type='name' placeholder='House name' className='entrance-input'>House name</Input>

                <Input id='email-input' type='email' placeholder='Email' className='entrance-input'>Email</Input>

                <Input id='password-input' type='Password' placeholder='Password' className='entrance-input'>Password</Input>

                <Button type='submit' className='cursor-pointer mt-5 p-[1.8rem] border-none rounded-md text-lg text-white bg-amber-400 w-[216px] h-[30px] flex justify-center items-center'>Register</Button>
            </Form>

            <nav className='text-sm flex justify-center gap-4 w-[100%] pt-14'>
                <p>Already have an account?</p>
                <Link className='underline underline-offset-2' onClick={handleLoginClick}>Log in</Link>
            </nav>
        </article>
    </Container>
}

export default Register