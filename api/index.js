import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
/* import multer from 'multer' */

import {
    registerHomeHandler,
    retrieveHomeHandler,
    authenticateHomeHandler,
    retrieveProfilesHandler,
    retrieveRoleHandler,
    authenticateProfileHandler,
    createTaskHandler,
    retrieveTasksHandler,
    retrieveProfileTasksHandler,
    deleteTaskHandler,
    assignTaskHandler,
    takeTaskHandler,
    delayTaskHandler,
    completeTaskHandler,
    retrieveTemplatesHandler,
    retrieveRoomsHandler,
    createTemplateHandler,
    redeemPointsHandler,
    deleteTemplateHandler,
    editTemplateHandler,
    createRoomHandler,
    deleteRoomHandler,
    editRoleHandler,
    deleteProfileHandler,
    deleteOwnProfileHandler,
    registerProfileHandler,
    changeProfileColorHandler,
    changePincodeHandler,
    uploadAvatarHandler,
    materializeTaskHandler,
} from './handlers/index.js'

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        const server = express()
        const jsonBodyParser = express.json()
        /* const storage = multer.memoryStorage()
        const upload = multer({ storage: storage }) */

        server.use(cors())

        server.get('/homes', retrieveHomeHandler)

        server.post('/homes', jsonBodyParser, registerHomeHandler)

        server.post('/homes/auth', jsonBodyParser, authenticateHomeHandler)

        server.get('/profiles', retrieveProfilesHandler)

        server.get('/profiles/:profileId/role', retrieveRoleHandler)

        server.post('/profiles', jsonBodyParser, registerProfileHandler)

        server.post('/profiles/auth', jsonBodyParser, authenticateProfileHandler)

        server.post('/profiles/:profileId/delete', deleteProfileHandler)

        server.post('/profiles/:profileId/delete-own', deleteOwnProfileHandler)

        /* server.patch('/profiles/:profileId/upload-avatar', upload.single('image'), uploadAvatarHandler) */

        server.patch('/profiles/:profileId/edit', jsonBodyParser, editRoleHandler)

        server.patch('/profiles/:profileId/changeColor', jsonBodyParser, changeProfileColorHandler)

        server.patch('/profiles/:profileId/pincode', jsonBodyParser, changePincodeHandler)

        server.get('/tasks/:week', retrieveTasksHandler)

        server.get('/tasks/:profileId/:week', retrieveProfileTasksHandler)

        server.post('/tasks', jsonBodyParser, createTaskHandler)

        server.post('/tasks/:taskId', jsonBodyParser, materializeTaskHandler)

        server.post('/tasks/:taskId/delete', deleteTaskHandler)

        server.patch('/tasks/:taskId/take', takeTaskHandler)

        server.patch('/tasks/:taskId/assign/:profileId', assignTaskHandler)

        server.patch('/tasks/:taskId/delay', jsonBodyParser, delayTaskHandler)

        server.patch('/tasks/:taskId/complete', jsonBodyParser, completeTaskHandler)

        server.get('/templates', retrieveTemplatesHandler)

        server.post('/templates', jsonBodyParser, createTemplateHandler)

        server.post('/templates/:templateId/delete', deleteTemplateHandler)

        server.patch('/templates/:templateId/edit', jsonBodyParser, editTemplateHandler)

        server.get('/rooms', retrieveRoomsHandler)

        server.post('/rooms', jsonBodyParser, createRoomHandler)

        server.post('/rooms/:roomId/delete', deleteRoomHandler)

        server.patch('/stats/:profileId/redeem', jsonBodyParser, redeemPointsHandler)

        const date = new Date()
        server.listen(process.env.PORT, () => console.log(`Server is online at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} in port ${process.env.PORT}`))
    })
    .catch(error => console.error(error))