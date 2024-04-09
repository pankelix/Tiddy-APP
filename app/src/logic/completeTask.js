import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const completeTask = (taskId, pincode, date) => {
    taskId = taskId.split('_')[0]
    validate.id(taskId, 'task id')
    validate.pincode(pincode)
    validate.date(date)

    const req = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.profileToken}`
        },
        body: JSON.stringify({ pincode, date })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/complete`, req)
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

export default completeTask