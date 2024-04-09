import { errors, validate } from 'com'
const { SystemError } = errors
import session from "./session"

function retrieveProfileTasks(week) {
    validate.number(week)
    validate.id(session.profileId, 'profile id')

    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${session.profileId}/${week}`, req)
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

export default retrieveProfileTasks