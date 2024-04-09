import bcrypt from 'bcryptjs'

import { validate, errors } from 'com'
const { SystemError, DuplicityError } = errors

import { Home } from '../data/models.js'

function registerHome(name, email, password) {
    validate.text(name, 'name')
    validate.email(email, 'email')
    validate.password(password, 'password')

    return (async () => {
        try {
            const hash = await bcrypt.hash(password, 8)

            const home = await Home.create({ name, email, password: hash })

            return home
        } catch (error) {
            if (error.code === 11000)
                throw new DuplicityError('home already exists')

            throw new SystemError(error.message)
        }
    })()
}

export default registerHome