import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import authenticateProfile from './authenticateProfile.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        const profileId = await authenticateProfile('Peter Pan', '1234')
        console.log('profile authenticated', profileId)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()