import mongoose from 'mongoose'
import uploadAvatar from './uploadAvatar.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await uploadAvatar('65d79ed33377222a975829fa', '65d79ed33377222a97582a18', '???')

        console.log('profile avatar changed')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()