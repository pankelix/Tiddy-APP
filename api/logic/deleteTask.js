import { Profile, Task } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, PermissionError } = errors

function deleteTask(profileId, taskId) {
    validate.id(profileId, 'profile id')
    validate.id(taskId, 'task id')

    return (async () => {
        let profile
        try {
            profile = await Profile.findById(profileId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        if (profile.role !== 'admin')
            throw new PermissionError('profile is not admin')

        let task
        try {
            task = await Task.findById(taskId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!task)
            throw new NotFoundError('task not found')

        try {
            await Task.findByIdAndDelete(taskId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (task.oldId)
            try {
                await Task.findByIdAndDelete(task.oldId.split('_')[0])
            } catch (error) {
                throw new SystemError(error.message)
            }
    })()
}

export default deleteTask