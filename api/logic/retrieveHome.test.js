import mongoose from 'mongoose'

import retrieveHome from './retrieveHome.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/test')

        const home = await retrieveHome('65d79ed33377222a975829fa')
        console.log('home retrieved', home)

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()