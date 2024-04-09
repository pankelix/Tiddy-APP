import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session.js'

const loginProfile = (name, pincode) => {
    validate.text(name, 'name')
    validate.pincode(pincode)

    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ name, pincode })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/auth`, req)
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
            const profileToken = await res.json()

            const payloadB64 = profileToken.slice(profileToken.indexOf('.') + 1, profileToken.lastIndexOf('.'))
            const payloadJson = atob(payloadB64)
            const payload = JSON.parse(payloadJson)
            const profileId = payload.sub

            session.profileId = profileId
            session.profileToken = profileToken
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default loginProfile