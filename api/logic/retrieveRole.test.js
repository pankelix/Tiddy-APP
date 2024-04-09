import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

import retrieveRole from './retrieveRole.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        const role = await retrieveRole('65d79ed33377222a97582a18')
        console.log('role retrieved', role)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()