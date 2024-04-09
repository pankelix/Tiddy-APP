import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import materializeTask from './materializeTask.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/project')

        const task = await materializeTask('65da45873f666061bc54cf1b', { home: '65da45873f666061bc54cf1b', template: { home: "65da45873f666061bc54cf1b", name: 'dust', periodicity: 4, points: 5, rooms: ['65da45873f666061bc54cf28', '65da45873f666061bc54cf32', '65da45873f666061bc54cf38'], _id: "65da45873f666061bc54cf44" }, assignee: '', done: false, date: "2024-03-23T22:59:59.999Z", id: "65da45873f666061bc54cf52_1" })
        // homeId, task

        console.log('task registered', task)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()