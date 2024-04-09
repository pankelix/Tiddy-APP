import bcrypt from 'bcryptjs'

import { validate, errors } from 'com'
const { SystemError, CredentialsError, NotFoundError } = errors

import { Home } from '../data/models.js'

function authenticateHome(email, password) {
    validate.email(email, 'email')
    validate.password(password, 'password')

    return (async () => {
        let home
        try {
            home = await Home.findOne({ email })
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        let match
        try {
            match = await bcrypt.compare(password, home.password)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!match)
            throw new CredentialsError('wrong password')

        return home.id
    })()
}

export default authenticateHome