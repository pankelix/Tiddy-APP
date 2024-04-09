import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const uploadAvatar = (image) => {

    const req = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${session.token}`
        },
        body: image
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${session.profileId}/upload-avatar`, req)
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

export default uploadAvatar