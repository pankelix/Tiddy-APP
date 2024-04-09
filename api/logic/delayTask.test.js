import mongoose from 'mongoose'
import delayTask from './delayTask.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await delayTask('65d79ed43377222a97582a2e', new Date)

        console.log('task delayed')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()