import { errors } from 'com'
const { SystemError } = errors

import session from './session'

const retrieveHome = () => {
    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/homes`, req)
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
            const home = await res.json()
            return home
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default retrieveHome