import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const changePincode = (oldPincode, newPincode) => {
    validate.pincode(oldPincode, 'old pincode')
    validate.pincode(newPincode, 'new pincode')

    const req = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.profileToken}`
        },
        body: JSON.stringify({ oldPincode, newPincode })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/profiles/${session.profileId}/pincode`, req)
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

export default changePincode