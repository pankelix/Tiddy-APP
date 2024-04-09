import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const editRole = (profileId, role) => {
    validate.id(profileId, 'profile id')
    validate.text(role)

    const req = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.profileToken}`
        },
        body: JSON.stringify({ role })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${profileId}/edit`, req)
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

export default editRole