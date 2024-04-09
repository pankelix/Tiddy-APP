import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import authenticateHome from './authenticateHome.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        const homeId = await authenticateHome('man@sion.com', '123123123')
        console.log('home authenticated', homeId)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()