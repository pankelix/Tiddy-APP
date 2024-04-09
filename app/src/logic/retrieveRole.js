import { errors } from 'com'
const { SystemError } = errors

import session from './session'

const retrieveRole = () => {
    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.profileToken}`
        }
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${session.profileId}/role`, req)
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
            const role = await res.json()
            return role
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default retrieveRole