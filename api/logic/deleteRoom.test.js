import mongoose from 'mongoose'
import deleteRoom from './deleteRoom.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await deleteRoom('65d79ed33377222a97582a18', '65d79ed33377222a97582a02')

        //profileId, roomId

        console.log('room deleted')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()