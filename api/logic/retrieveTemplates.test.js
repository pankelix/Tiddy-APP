import mongoose from 'mongoose'

import retrieveTemplates from './retrieveTemplates.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')
        const template = await retrieveTemplates('65d79ed33377222a975829fa')
        console.log('template retrieved', template)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()