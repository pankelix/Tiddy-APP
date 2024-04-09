import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import deleteTask from './deleteTask.js'
import { Profile, Task } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('deleteTask', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing profile and task', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        const task = await Task.create({ home: random.id(), template: random.id(), date: new Date() })

        expect(task).to.exist

        const taskId = task.id

        try {
            const value = await deleteTask(profileId, taskId)
            expect(value).to.be.undefined
            const taskToNotFind = await Task.findById(taskId)
            expect(taskToNotFind).to.be.null

        } catch (error) {
            throw new Error(error)
        }
    })

    it('fails on non existing profile', async () => {
        try {
            await deleteTask(random.id(), random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    it('fails on profile is not admin', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash })

        const profileId = profile._id.toString()

        try {
            await deleteTask(profileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('profile is not admin')
        }
    })

    it('fails on non existing task', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        try {
            await deleteTask(profileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('task not found')
        }

        after(async () => await mongoose.disconnect())
    })
})