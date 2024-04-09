import { validate, errors } from 'com'
const { SystemError } = errors

import { Room } from '../data/models.js'

function createRoom(name, homeId) {
    validate.text(name, 'name')
    validate.id(homeId, 'home id')

    return (async () => {
        try {
            const room = await Room.create({ name, home: homeId })

            return room
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default createRoom