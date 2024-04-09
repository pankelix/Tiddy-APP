import { validate, errors } from 'com'
const { SystemError, NotFoundError, PermissionError } = errors

import { Profile } from '../data/models.js'

function editRole(sessionProfileId, profileId, role) {
    validate.id(sessionProfileId, 'session profile id')
    validate.id(profileId, 'profile id')
    validate.text(role, 'role')

    return (async () => {
        let sessionProfile
        try {
            sessionProfile = await Profile.findById(sessionProfileId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!sessionProfile)
            throw new NotFoundError('session profile not found')

        if (sessionProfile.role !== 'admin')
            throw new PermissionError('session profile is not admin')

        let profile
        try {
            profile = await Profile.findById(profileId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        profile.role = role

        try {
            await profile.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default editRole