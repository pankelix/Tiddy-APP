import mongoose from 'mongoose'
import { expect } from 'chai'
import { dayStart } from '@formkit/tempo'

import random from './helpers/random.js'
import createTask from './createTask.js'
import { Home, Task, Template } from "../data/models.js"
import { NotFoundError, ContentError } from 'com/errors.js'

describe('createTask', async () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Task.deleteMany(), Template.deleteMany()]))

    it('succeeds on correct data', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        const templateName = random.name()
        const roomId = random.id()
        const roomId2 = random.id()

        let template = await Template.create({ home: homeId, name: templateName, rooms: [roomId, roomId2], periodicity: 7, points: 15 })

        const templateId = template._id.toString()

        let taskDate = new Date()
        taskDate.setDate(taskDate.getDate() + 1) //tomorrow
        const finalTaskDate = taskDate.toISOString().split('T')[0]

        await createTask(homeId, templateId, finalTaskDate)

        taskDate = dayStart(taskDate)

        try {
            const task = await Task.findOne({ home: homeId })

            expect(task).to.exist
            expect(task.home._id.toString()).to.equal(homeId)
            expect(task.template._id.toString()).to.equal(templateId)
            expect(task.done).to.be.false
            expect(task.delay).to.equal(0)
            expect(task.assignee).to.not.exist
            expect(task.oldId).to.not.exist
        } catch (error) {
            throw new Error('should not reach this point')
        }
    })

    it('fails on no home found', async () => {
        const randomHomeId = random.id()
        const randomTemplateId = random.id()

        let taskDate = new Date()
        taskDate.setDate(taskDate.getDate() + 1) //tomorrow
        const finalTaskDate = taskDate.toISOString().split('T')[0]

        try {
            await createTask(randomHomeId, randomTemplateId, finalTaskDate)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    it('fails on no template found', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()
        const randomTemplateId = random.id()

        let taskDate = new Date()
        taskDate.setDate(taskDate.getDate() + 1) //tomorrow
        const finalTaskDate = taskDate.toISOString().split('T')[0]

        try {
            await createTask(homeId, randomTemplateId, finalTaskDate)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('template not found')
        }

    })

    it('fails on date later than today', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        const templateName = random.name()
        const roomId = random.id()
        const roomId2 = random.id()

        let template = await Template.create({ home: homeId, name: templateName, rooms: [roomId, roomId2], periodicity: 7, points: 15 })

        const templateId = template._id.toString()

        let wrongDate = new Date()
        wrongDate.setDate(wrongDate.getDate() - 1) //tomorrow
        const finalWrongDate = wrongDate.toISOString().split('T')[0]

        try {
            await createTask(homeId, templateId, finalWrongDate)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('date must be after today')
        }
    })

    after(async () => await mongoose.disconnect())
})