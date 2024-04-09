import mongoose from 'mongoose'
import deleteTask from './deleteTask.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await deleteTask('65d79ed33377222a97582a18', '65d79ed43377222a97582a36')

        console.log('task deleted')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()