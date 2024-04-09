import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Profile } from '../data/models.js'

function retrieveRole(profileId) {
    validate.id(profileId)

    return (async () => {

        let profile
        try {
            profile = await Profile.findById(profileId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        return profile.role
    })()
}

export default retrieveRole