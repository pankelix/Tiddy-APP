import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import createTemplate from './createTemplate.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        await createTemplate('65eb7378e9410ed5aa416546', 'Limpiar ducha', 3, 'week', ['12345'], 15)

        // homeId, name, periodicityNumber, periodicityRange, rooms, points

        console.log('template registered')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()