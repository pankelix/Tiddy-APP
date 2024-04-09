import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import createTask from './createTask.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/project2')

        await createTask('65eb75180a9a6ff9f9422237', '65eb87240a9a6ff9f94223f0', '03-07-2024')
        // homeId, templateId, date

        console.log('task registered')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()