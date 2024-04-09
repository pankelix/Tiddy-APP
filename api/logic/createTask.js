import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Home, Template, Task } from '../data/models.js'
import { ContentError } from 'com/errors.js'


function createTask(homeId, templateId, date) {
    validate.id(homeId, 'home id')
    validate.id(templateId, 'template id')
    validate.date(date)

    return (async () => {
        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        let template
        try {
            template = await Template.findById(templateId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!template)
            throw new NotFoundError('template not found')

        let creationDate = new Date(date)
        creationDate.setHours(0, 0, 0, 0)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (creationDate < today)
            throw new ContentError('date must be after today')

        try {
            const task = await Task.create({ home: homeId, template: templateId, date: creationDate })

            return task
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default createTask