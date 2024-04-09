import { errors, validate } from 'com'
const { SystemError } = errors
import session from "./session"

function retrieveTasks(week) {
    validate.number(week)

    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${week}`, req) //tasks/numerodedias (para que me traiga solo los numeros de días que yo le diga)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!res.ok) {
            let body
            try {
                body = await res.json()
            } catch (error) {
                throw new SystemError(error.message)
            }

            throw new errors[body.error](body.message)
        }

        try {
            const tasks = await res.json()
            return tasks
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default retrieveTasks