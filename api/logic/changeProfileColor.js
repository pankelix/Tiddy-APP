import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Profile } from '../data/models.js'

function changeProfileColor(profileId, color) {
    validate.id(profileId, 'profile id')
    validate.object(color, 'color')

    return (async () => {
        let profile
        try {
            profile = await Profile.findById(profileId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        profile.color = color

        try {
            await profile.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default changeProfileColor