import mongoose from 'mongoose'
import deleteTemplate from './deleteTemplate.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await deleteTemplate('65d79ed33377222a97582a18', '65d79ed43377222a97582a22')

        console.log('template and tasks associated deleted')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()