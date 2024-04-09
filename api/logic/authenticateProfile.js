import bcrypt from 'bcryptjs'

import { validate, errors } from 'com'
const { SystemError, CredentialsError, NotFoundError } = errors

import { Home, Profile } from '../data/models.js'


function authenticateProfile(homeId, name, pincode) {
    validate.id(homeId)
    validate.text(name, 'name')
    validate.pincode(pincode)

    return (async () => {
        let home
        try {
            home = await Home.findById(homeId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        let profile
        try {
            profile = await Profile.findOne({ name })
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        let match
        try {
            match = await bcrypt.compare(pincode, profile.pincode)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!match)
            throw new CredentialsError('wrong pincode')

        return profile.id
    })()
}

export default authenticateProfile