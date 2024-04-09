import mongoose from 'mongoose'
import assignTask from './assignTask.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await assignTask('65d79ed43377222a97582a1c', '65d79ed43377222a97582a3a', null)

        console.log('task assigned')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()