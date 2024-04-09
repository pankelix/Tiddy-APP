import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import editTemplate from './editTemplate.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await editTemplate('65d79ed33377222a97582a18', '65d79ed43377222a97582a24', 'Do dishes 2 electric boogaloo', 3, 'week', ['65d79ed33377222a97582a02', '65d79ed33377222a97582a04'], 15)

        //profileId, templateId, name, periodicityNumber, periodicityRange, rooms, points

        console.log('template edited')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()