import bcrypt from 'bcryptjs'

import { validate, errors } from 'com'
const { SystemError, NotFoundError, ContentError, CredentialsError } = errors

import { Profile } from '../data/models.js'

function changePincode(profileId, oldPincode, newPincode) {
    validate.id(profileId, 'session profile id')
    validate.pincode(oldPincode, 'old pincode')
    validate.pincode(newPincode, 'new pincode')

    return (async () => {
        if (oldPincode === newPincode)
            throw new ContentError('old pincode and new pincode are equal')

        let profile
        try {
            profile = await Profile.findById(profileId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        //comprobar oldpincode
        let match
        try {
            match = await bcrypt.compare(oldPincode, profile.pincode)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!match)
            throw new CredentialsError('wrong pincode')

            let hash
        try {
            hash = await bcrypt.hash(newPincode, 8)
        } catch (error) {
            throw new SystemError(error.message)
        }

        profile.pincode = hash

        try {
            await profile.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default changePincode