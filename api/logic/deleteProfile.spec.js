import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import deleteProfile from './deleteProfile.js'
import { Profile, Task } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('deleteProfile', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing sessionProfile and profile', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin', color: { name: random.name(), code: random.name() } })

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, color: { name: random.name(), code: random.name() } })

        const sessionProfileId = sessionProfile._id.toString()
        const profileId = profile._id.toString()

        const homeId = random.id()
        const templateId = random.id()

        const task = await Task.create({ home: homeId, template: templateId, assignee: profileId, })

        expect(task).to.exist
        expect(task.home._id.toString()).to.equal(homeId)
        expect(task.template._id.toString()).to.equal(templateId)

        const taskId = task._id.toString()

        try {
            const value = await deleteProfile(sessionProfileId, profileId)
            expect(value).to.be.undefined

            const profileToNotFind = await Profile.findById(profileId)
            expect(profileToNotFind).to.be.null

            const taskToNotFind = await Task.findOne({ assignee: profileId })
            expect(taskToNotFind).to.be.null
        } catch (error) {
            throw new Error(error)
        }
    })

    it('fails on non existing sessionProfile', async () => {
        try {
            await deleteProfile(random.id(), random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('sessionProfile not found')
        }
    })

    it('fails on profile is not admin', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash })

        const profileId = profile._id.toString()

        try {
            await deleteProfile(profileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('sessionProfile is not admin')
        }
    })

    it('fails on non existing profile', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const sessionProfileId = profile._id.toString()
        try {
            await deleteProfile(sessionProfileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })
})