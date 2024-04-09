import logic from '../logic/index.js'

import jwt from 'jsonwebtoken'

import { errors } from 'com'

const { NotFoundError, ContentError, CredentialsError } = errors

export default async (req, res) => {
    const { name, pincode } = req.body

    const token = req.headers.authorization.substring(7)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const homeId = payload.sub

    let profileId
    try {
        profileId = await logic.authenticateProfile(homeId, name, pincode)

        const profileToken = jwt.sign({ sub: profileId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPI })

        res.json(profileToken)
    } catch (error) {
        let status = 500

        if (error instanceof CredentialsError)
            status = 401

        if (error instanceof NotFoundError)
            status = 404

        if (error instanceof ContentError || error instanceof TypeError)
            status = 406

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}