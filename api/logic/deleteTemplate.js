import { Profile, Template, Task } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, PermissionError } = errors

function deleteTemplate(profileId, templateId) {
    validate.id(profileId, 'profile id')
    validate.id(templateId, 'template id')

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

        try {
            await Task.deleteMany({ 'template': templateId })
        } catch (error) {
            throw new SystemError(error.message)
        }

        let template
        try {
            template = await Template.findById(templateId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!template)
            throw new NotFoundError('template not found')

        try {
            await Template.findByIdAndDelete(templateId)
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default deleteTemplate