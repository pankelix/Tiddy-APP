import mongoose from 'mongoose'
import createRoom from './createRoom.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await createRoom('65d79ed33377222a975829fa', 'parking')

        console.log('room created')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()