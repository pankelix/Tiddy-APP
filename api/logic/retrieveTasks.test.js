import mongoose from 'mongoose'

import retrieveTasks from './retrieveTasks.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/project')

        const task = await retrieveTasks('65da45873f666061bc54cf1b', 0)
        console.log('task retrieved', task)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()