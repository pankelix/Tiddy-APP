import logic from '../logic/index.js'

import { errors } from 'com'

const { DuplicityError, ContentError } = errors

export default async (req, res) => {
    const { name, email, password } = req.body
    try {
        await logic.registerHome(name, email, password)
    } catch (error) {
        let status = 500

        if (error instanceof DuplicityError)
            status = 409

        if (error instanceof ContentError || error instanceof TypeError)
            status = 406

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }

    res.status(201).send()
}