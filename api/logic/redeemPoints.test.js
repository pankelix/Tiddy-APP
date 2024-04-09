import mongoose from 'mongoose'
import redeemPoints from './redeemPoints.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await redeemPoints('65d79ed43377222a97582a1a', '65d79ed33377222a97582a18', 15)

        console.log('points redeemed')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()