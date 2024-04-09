import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Home } from '../data/models.js'

function retrieveHome(homeId) {
    validate.id(homeId)

    return (async () => {

        let home
        try {
            home = await Home.findById(homeId, 'name').lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        home.id = home._id.toString()
        delete home._id

        return home
    })()
}

export default retrieveHome