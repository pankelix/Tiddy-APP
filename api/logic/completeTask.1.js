import bcrypt from 'bcryptjs'

import { validate, errors } from 'com'
const { SystemError, NotFoundError, CredentialsError, PermissionError } = errors

import { Profile, Task } from '../data/models.js'
import { ContentError } from 'com/errors.js'

function completeTask(profileId, taskId, pincode, date) {
    validate.id(profileId, 'profile id')
    validate.id(taskId, 'task id')
    validate.pincode(pincode)
    validate.date(date)

    return (async () => {

        let profile
        try {
            profile = await Profile.findById(profileId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!profile)
            throw new NotFoundError('profile not found')

        if (profile.role !== 'admin')
            throw new PermissionError('profile is not admin')

        let match
        try {
            match = await bcrypt.compare(pincode, profile.pincode)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!match)
            throw new CredentialsError('pincode not correct')

        let task
        try {
            task = await Task.findById(taskId).populate('template')
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!task)
            throw new NotFoundError('task not found')

        if (task.done === true)
            throw new ContentError('this task is already done')

        date = new Date(date)

        /* if (date < task.date)
            throw new ContentError("tasks can't be completed before their due date") */

        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + task.template.periodicity)

        task.date = newDate

        task.done = true

        task.assignee = undefined

        profile.points += task.template.points

        try {
            await task.save()
            await profile.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default completeTask