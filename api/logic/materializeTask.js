import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { Home, Task } from '../data/models.js'
import { ContentError } from 'com/errors.js'


function materializeTask(homeId, task) {
    validate.id(homeId, 'home id')
    validate.object(task)

    return (async () => {
        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        let materializationDate = new Date(task.date)
        materializationDate.setHours(0, 0, 0, 0)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (materializationDate < today)
            throw new ContentError('date must be after today')

        try {
            const materializedTask = await Task.create({ home: homeId, template: task.template._id, date: materializationDate, oldId: task.id })

            return materializedTask._id.toString()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default materializeTask