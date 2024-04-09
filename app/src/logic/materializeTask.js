import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const materializeTask = (task/* , profileId */) => {
    /* if (profileId)
        validate.id(profileId, 'profile id') */
    validate.object(task)

    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ task })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${task.id}`, req)
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
            const materializedTaskId = await res.json()
            return materializedTaskId
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default materializeTask