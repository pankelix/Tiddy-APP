import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import completeTask from './completeTask.js'
import { Profile, Template, Task } from '../data/models.js'

import { errors } from 'com'
import { ContentError } from 'com/errors.js'
import { addDay, format } from '@formkit/tempo'
const { NotFoundError, CredentialsError, PermissionError } = errors

describe('completeTask', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Template.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing profile and task', async () => {
        const pincode = random.pincode()

        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        const template = await Template.create({ home: random.id(), name: random.name(), rooms: [random.id(), random.id()], points: 100, periodicity: 7 })

        const templateId = template._id.toString()

        const task = await Task.create({ home: random.id(), template: templateId, assignee: random.id() })

        const taskId = task._id.toString()


        await completeTask(profileId, taskId, pincode, format(addDay(new Date(), -1), 'YYYY-MM-DD'))

        const taskdeleted = await Task.findById(taskId)
        const newTask = await Task.find({ done: true })
        const profileFound = await Profile.findById(profileId)

        expect(taskdeleted).to.not.exist
        expect(newTask).to.exist
        expect(newTask.assignee).to.be.undefined

        expect(profileFound.points).to.equal(100)
    })

    it('fails on non existing profile', async () => {
        try {
            await completeTask(random.id(), random.id(), random.pincode(), '2024-03-04')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    it('fails on profile not admin', async () => {
        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.id() })

        const profileId = profile._id.toString()
        try {
            await completeTask(profileId, random.id(), random.pincode(), '2024-03-04')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('profile is not admin')
        }
    })

    it('fails on pincode not correct', async () => {
        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.id(), role: 'admin' })

        const profileId = profile._id.toString()
        try {
            await completeTask(profileId, random.id(), random.pincode(), '2024-03-04')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.equal('pincode not correct')
        }
    })

    it('fails on non existing task', async () => {
        const pincode = random.pincode()

        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        try {
            await completeTask(profileId, random.id(), pincode, '2024-03-04')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('task not found')
        }
    })

    it('fails on task already done', async () => {
        const pincode = random.pincode()

        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        const task = await Task.create({ home: random.id(), template: random.id(), assignee: random.id(), done: true })

        const taskId = task._id.toString()

        try {
            await completeTask(profileId, taskId, pincode, '2024-03-04')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('this task is already done')
        }
    })

    after(async () => await mongoose.disconnect())
})