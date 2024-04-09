import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Home, Profile } from '../data/models.js'

function uploadAvatar(homeId, profileId, originalname, mimetype, oldPath) {
    validate.id(homeId, 'home id')
    validate.id(profileId, 'profile id')
    validate.text(originalname, 'file name')
    validate.text(mimetype, 'file type')

    return (async () => {
        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        let profile
        try {
            profile = await Profile.findById(profileId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        profile.avatar = {
            name: originalname,
            type: mimetype
        }

        const newPath = `./uploads/${profile.avatar._id.toString()}`

        try {
            await profile.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default uploadAvatar