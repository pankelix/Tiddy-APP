import mongoose from 'mongoose'
import deleteProfile from './deleteProfile.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await deleteProfile('65d79ed33377222a97582a18', '65d79ed43377222a97582a1e')

        console.log('profile deleted')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()