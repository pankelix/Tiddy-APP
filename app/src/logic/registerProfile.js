import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const registerProfile = (name, pincode, chosenColor) => {
    validate.text(name, 'name')
    validate.pincode(pincode)
    validate.object(chosenColor, 'chosen color')

    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ name, pincode, chosenColor })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/profiles`, req)
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

export default registerProfile