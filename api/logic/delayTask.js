import { validate, errors } from 'com'
const { SystemError, NotFoundError, ContentError } = errors

import { Task, Profile } from '../data/models.js'

function delayTask(profileId, taskId, date) {
    validate.id(profileId, 'profile id')
    validate.id(taskId, 'task id')
    validate.date(date)

    return (async () => {
        let profile
        try {
            profile = await Profile.findById(profileId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        let task
        try {
            task = await Task.findById(taskId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!task)
            throw new NotFoundError('task not found')

        let delayDate = new Date(date)
        delayDate.setHours(0, 0, 0, 0)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (delayDate < today)
            throw new ContentError('date must be after today')

        task.date = delayDate
        task.delay = task.delay + 1

        try {
            await task.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default delayTask