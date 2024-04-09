import jwt from 'jsonwebtoken'
const { JsonWebTokenError } = jwt

import { errors } from 'com'
const { NotFoundError, ContentError, TokenError } = errors

import logic from '../logic/index.js'

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const profileId = payload.sub

    const { templateId } = req.params

    const { name, periodicityNumber, periodicityRange, rooms, points } = req.body
    try {
        await logic.editTemplate(profileId, templateId, name, periodicityNumber, periodicityRange, rooms, points)
    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError)
            status = 404

        if (error instanceof DuplicityError)
            status = 409

        if (error instanceof ContentError || error instanceof TypeError)
            status = 406

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }

    res.status(201).send()
}