import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import takeTask from './takeTask.js'
import { Profile, Template, Task } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('takeTask', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Template.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing session profile and task', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin' })

        const sessionProfileId = sessionProfile._id.toString()

        const task = await Task.create({ home: random.id(), template: random.id(), assignee: random.id() })

        const taskId = task._id.toString()

        await takeTask(sessionProfileId, taskId)

        const taskFound = await Task.findById(taskId)

        expect(taskFound.assignee._id.toString()).to.equal(sessionProfileId)
    })

    it('fails on non existing task', async () => {
        try {
            await takeTask(random.id(), random.id(), random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('task not found')
        }
    })

    it('fails on non existing session profile', async () => {
        const task = await Task.create({ home: random.id(), template: random.id(), assignee: random.id() })

        const taskId = task._id.toString()
        try {
            await takeTask(random.id(), taskId, null)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('session profile not found')
        }
    })

    after(async () => await mongoose.disconnect())
})