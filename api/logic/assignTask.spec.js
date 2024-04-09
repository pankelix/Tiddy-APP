import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import assignTask from './assignTask.js'
import { Profile, Template, Task } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('assignTask', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Template.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing session profile, profile and task', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin' })

        const sessionProfileId = sessionProfile._id.toString()

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        const task = await Task.create({ home: random.id(), template: random.id(), assignee: random.id() })

        const taskId = task._id.toString()

        await assignTask(sessionProfileId, taskId, profileId)

        const taskFound = await Task.findById(taskId)

        expect(taskFound.assignee._id.toString()).to.equal(profileId)
    })

    it('fails on non existing task', async () => {
        try {
            await assignTask(random.id(), random.id(), random.id())
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
            await assignTask(random.id(), taskId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('session profile not found')
        }
    })

    it('fails on profile not admin', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.id() })

        const sessionProfileId = sessionProfile._id.toString()

        const task = await Task.create({ home: random.id(), template: random.id(), assignee: random.id() })

        const taskId = task._id.toString()
        try {
            await assignTask(sessionProfileId, taskId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('session profile is not admin')
        }
    })

    it('fails on non existing profile', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.id(), role: 'admin' })

        const sessionProfileId = sessionProfile._id.toString()

        const task = await Task.create({ home: random.id(), template: random.id(), assignee: random.id() })

        const taskId = task._id.toString()
        try {
            await assignTask(sessionProfileId, taskId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    after(async () => await mongoose.disconnect())
})