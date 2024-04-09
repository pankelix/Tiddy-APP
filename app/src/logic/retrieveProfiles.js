import { errors } from 'com'
import session from './session'
const { SystemError } = errors

function retrieveProfiles() {
    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
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

        try {
            const profiles = await res.json()
            return profiles
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default retrieveProfiles