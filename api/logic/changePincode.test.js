import mongoose from 'mongoose'
import changePincode from './changePincode.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await changePincode('65d79ed43377222a97582a1a', '1234', '2345')

        console.log('pincode edited')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()