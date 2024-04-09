import logic from '../logic/index.js'

import jwt from 'jsonwebtoken'

import { errors } from 'com'

const { NotFoundError, ContentError, CredentialsError } = errors

export default async (req, res) => {
    const { email, password } = req.body

    let homeId
    try {
        homeId = await logic.authenticateHome(email, password)

        const token = jwt.sign({ sub: homeId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPI })

        res.json(token)
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