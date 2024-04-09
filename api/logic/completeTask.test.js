import mongoose from 'mongoose'
import completeTask from './completeTask.js'

(async () => {
    const date = '2024-03-01'
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await completeTask('65f4797be26873325602dda6', '65f4797be26873325602ddd9', '1234', '2024-03-14')
        //sessionProfileId, taskId, pincode, completionDate

        console.log('task completed')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()