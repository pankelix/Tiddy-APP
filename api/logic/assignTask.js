import { validate, errors } from 'com'
const { SystemError, NotFoundError, PermissionError } = errors

import { Task, Profile } from '../data/models.js'

function assignTask(sessionProfileId, taskId, profileId) {
    validate.id(sessionProfileId, 'session profile id')
    validate.id(taskId, 'task id')
    validate.id(profileId, 'profile id')

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

        if (sessionProfile.role !== 'admin')
            throw new PermissionError('session profile is not admin')

        let assignedProfile
        try {
            assignedProfile = await Profile.findById(profileId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!assignedProfile)
            throw new NotFoundError('profile not found')

        task.assignee = profileId

        try {
            await task.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default assignTask