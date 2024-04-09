import { validate, errors } from 'com'
const { SystemError, NotFoundError, ContentError, PermissionError } = errors

import { Template, Profile } from '../data/models.js'

function editTemplate(profileId, templateId, name, periodicityNumber, periodicityRange, rooms, points) {
    validate.id(profileId, 'profile id')
    validate.id(templateId, 'template id')
    validate.text(name, 'name')
    validate.number(periodicityNumber, 'periodicity number')
    validate.text(periodicityRange, 'periodicity range')
    validate.array(rooms, 'rooms')
    validate.number(points, 'points')

    return (async () => {
        if (periodicityNumber === 0)
            throw new ContentError("periodicity can't be 0")

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

        let periodicity
        if (periodicityRange === 'day')
            periodicity = periodicityNumber
        else if (periodicityRange === 'week')
            periodicity = periodicityNumber * 7

        let template
        try {
            template = await Template.findById(templateId)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!template)
            throw new NotFoundError('template not found')

        template.name = name
        template.periodicity = periodicity
        template.rooms = rooms
        template.points = points

        try {
            await template.save()
        } catch (error) {
            throw new SystemError(error.message)
        }
    })()
}

export default editTemplate