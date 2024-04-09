import mongoose from 'mongoose'

import retrieveRooms from './retrieveRooms.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        const rooms = await retrieveRooms('65d79ed33377222a975829fa')
        console.log('rooms retrieved', rooms)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()