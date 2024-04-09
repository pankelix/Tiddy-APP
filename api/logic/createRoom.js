import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Room, Home } from '../data/models.js'

function createRoom(homeId, name) {
    validate.id(homeId, 'home id')
    validate.text(name, 'name')

    return (async () => {
        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        try {
            const room = await Room.create({ home: homeId, name })

            return room
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default createRoom