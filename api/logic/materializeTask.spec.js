import mongoose from 'mongoose'
import { expect } from 'chai'
import { dayStart } from '@formkit/tempo'

import random from './helpers/random.js'
import materializeTask from './materializeTask.js'
import { Home, Template, Task } from "../data/models.js"
import { NotFoundError, ContentError } from 'com/errors.js'

describe('materializeTask', async () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Task.deleteMany()]))

    it('succeeds on correct data', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        const templateName = random.name()
        const roomId = random.id()
        const roomId2 = random.id()

        let template = await Template.create({ home: homeId, name: templateName, rooms: [roomId, roomId2], periodicity: 7, points: 15 })

        const templateId = template._id.toString()

        let taskDate = new Date()
        taskDate.setDate(taskDate.getDate() + 5)

        const finalTaskDate = taskDate.toISOString().split('T')[0]

        const oldTask = await Task.create({ home: homeId, template: templateId, date: finalTaskDate })


        const materializedTaskId = await materializeTask(homeId, oldTask)

        try {
            const materializedTask = await Task.findById(materializedTaskId)

            expect(materializedTask).to.exist
            expect(materializedTask.home._id.toString()).to.equal(homeId)
            expect(materializedTask.done).to.be.false
            expect(materializedTask.delay).to.equal(0)
            expect(materializedTask.assignee).to.not.exist
            expect(materializedTask.oldId).to.equal(oldTask.id)
        } catch (error) {
            throw new Error('should not reach this point')
        }
    })

    it('fails on no home found', async () => {
        const randomHomeId = random.id()
        const task = {}

        try {
            await materializeTask(randomHomeId, task)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    it('fails on date before today', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        const templateName = random.name()
        const roomId = random.id()
        const roomId2 = random.id()

        let template = await Template.create({ home: homeId, name: templateName, rooms: [roomId, roomId2], periodicity: 7, points: 15 })

        const templateId = template._id.toString()

        let taskDate = new Date()
        taskDate.setDate(taskDate.getDate() - 5)
        const finalTaskDate = taskDate.toISOString().split('T')[0]

        const oldTask = await Task.create({ home: homeId, template: templateId, date: finalTaskDate })

        try {
            await materializeTask(homeId, oldTask)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('date must be after today')
        }
    })

    after(async () => await mongoose.disconnect())
})