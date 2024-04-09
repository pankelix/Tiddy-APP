import mongoose from 'mongoose'

import retrieveProfileTasks from './retrieveProfileTasks.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/project')

        const task = await retrieveProfileTasks('65da45873f666061bc54cf1b', '65da45873f666061bc54cf3e', 0)
        console.log('task retrieved', task)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()