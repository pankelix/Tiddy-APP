import { validate, errors } from 'com'
const { SystemError, NotFoundError, ContentError } = errors

import { Home, Room, Template } from '../data/models.js'


function createTemplate(homeId, name, periodicityNumber, periodicityRange, rooms, points) {
    validate.id(homeId, 'home id')
    validate.text(name, 'name')
    validate.number(periodicityNumber, 'periodicity number')
    validate.text(periodicityRange, 'periodicity range')
    validate.array(rooms, 'rooms')
    validate.number(points, 'points')

    return (async () => {
        if (periodicityNumber === 0)
            throw new ContentError("periodicity can't be 0")

        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        if (rooms.length === 0)
            throw new NotFoundError('rooms not found')

        let roomsFound = []

        for (const roomId of rooms) {
            try {
                const foundRoom = await Room.findById(roomId)
                if (foundRoom)
                    roomsFound.push(foundRoom)
            } catch (error) {
                throw new SystemError(error.message)
            }
        }

        if (roomsFound.length === 0)
            throw new NotFoundError('room not found')

        let periodicity
        if (periodicityRange === 'day')
            periodicity = periodicityNumber
        else if (periodicityRange === 'week')
            periodicity = periodicityNumber * 7

        try {
            const template = await Template.create({ home: homeId, name, rooms, periodicity, points })

            return template
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default createTemplate