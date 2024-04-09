import { validate, errors } from 'com'
const { SystemError, NotFoundError, PermissionError } = errors

import { Task, Profile } from '../data/models.js'

function takeTask(sessionProfileId, taskId) {
    validate.id(sessionProfileId, 'session profile id')
    validate.id(taskId, 'task id')

    return (async () => {
        let task
        try {
            task = await Task.findById(taskId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!task)
            throw new NotFoundError('task not found')

        let sessionProfile
        try {
            sessionProfile = await Profile.findById(sessionProfileId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!sessionProfile)
            throw new NotFoundError('session profile not found')

        task.assignee = sessionProfileId

        try {
            await task.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default takeTask