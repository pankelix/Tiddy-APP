import mongoose from 'mongoose'

import retrieveProfiles from './retrieveProfiles.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        const task = await retrieveProfiles('65d79ed33377222a975829fa')
        console.log('profile retrieved', task)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()