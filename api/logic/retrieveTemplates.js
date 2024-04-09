import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Home, Template } from '../data/models.js'

function retrieveTemplates(homeId) {
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

        let templates
        try {
            templates = await Template.find({ home: homeId }).populate({ path: 'rooms', select: 'name' }).select('-__v').lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        templates.forEach(template => {
            template.id = template._id.toString()
            delete template._id

            /* if (template.home._id) {
                template.home.id = template.home._id.toString()
                delete template.home._id
            } */

            /* if (template.rooms.length >= 1) {
                template.rooms.forEach(room => {
                    if (room._id) {
                        room.id = room._id.toString()
                        delete room._id
                    }
                })
            } */
        })

        return templates
    })()
}

export default retrieveTemplates