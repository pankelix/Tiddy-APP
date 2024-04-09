import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Home, Room } from '../data/models.js'

function retrieveRooms(homeId) {
    validate.id(homeId)

    return (async () => {

        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        let rooms
        try {
            rooms = await Room.find({ home: homeId }).select('-__v').lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        rooms.forEach(room => {
            room.id = room._id.toString()
            delete room._id
        })

        return rooms
    })()
}

export default retrieveRooms