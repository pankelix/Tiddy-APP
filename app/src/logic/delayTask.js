import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const delayTask = (taskId, date) => {
    validate.id(taskId, 'task id')
    validate.date(date)

    const req = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.profileToken}`
        },
        body: JSON.stringify({ date })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/delay`, req)
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
    })()
}

export default delayTask