import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session.js'

const loginHome = (email, password) => {
    validate.email(email)
    validate.password(password)

    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/homes/auth`, req)
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
            const token = await res.json()

            const payloadB64 = token.slice(token.indexOf('.') + 1, token.lastIndexOf('.'))
            const payloadJson = atob(payloadB64)
            const payload = JSON.parse(payloadJson)
            const homeId = payload.sub

            session.homeId = homeId
            session.token = token
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default loginHome