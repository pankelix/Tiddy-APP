import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const editTemplate = (templateId, name, periodicityNumber, periodicityRange, rooms, points) => {
    validate.id(templateId, 'template id')
    validate.text(name, 'name')
    validate.number(periodicityNumber, 'periodicity number')
    validate.text(periodicityRange, 'periodicity range')
    validate.array(rooms, 'rooms')
    validate.number(points, 'points')

    const req = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.profileToken}`
        },
        body: JSON.stringify({ name, periodicityNumber, periodicityRange, rooms, points })
    }

    return (async () => {
        let res
        try {
            res = await fetch(`${import.meta.env.VITE_API_URL}/templates/${templateId}/edit`, req)
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!res.ok) {
            let body

            try {
                body = await res.json()
            } catch (error) {
                throw new SystemError(error.message)
            }

            throw new errors[body.error](body.message)
        }
    })()
}

export default editTemplate