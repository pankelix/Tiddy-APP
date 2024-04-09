import mongoose from 'mongoose'
import editRole from './editRole.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await editRole('65d79ed33377222a97582a18', '65d79ed43377222a97582a1c', 'admin')

        console.log('role edited')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()