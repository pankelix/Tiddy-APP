import mongoose from 'mongoose'
import changeProfileColor from './changeProfileColor.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await changeProfileColor('65d79ed33377222a97582a18', { name: 'Blue', code: '#3498DB' })

        console.log('profile color changed')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()