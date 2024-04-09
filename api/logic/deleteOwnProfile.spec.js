import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import deleteOwnProfile from './deleteOwnProfile.js'
import { Profile, Task } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('deleteOwnProfile', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing sessionProfile', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin', color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin', color: { name: random.name(), code: random.name() } })

        const homeId = random.id()
        const templateId = random.id()

        const task = await Task.create({ home: homeId, template: templateId, assignee: profileId })

        expect(task).to.exist
        expect(task.home._id.toString()).to.equal(homeId)
        expect(task.template._id.toString()).to.equal(templateId)

        const taskId = task._id.toString()

        try {
            const value = await deleteOwnProfile(profileId)
            expect(value).to.be.undefined

            const profileToNotFind = await Profile.findById(profileId)
            expect(profileToNotFind).to.be.null

            const taskToNotFind = await Task.findOne({ assignee: profileId })
            expect(taskToNotFind).to.be.null
        } catch (error) {
            throw new Error(error)
        }
    })

    it('fails on non existing profile', async () => {
        try {
            await deleteOwnProfile(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    it('fails on being the only admin', async () => {
        const adminProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin', color: { name: random.name(), code: random.name() } })

        const adminProfileId = adminProfile._id.toString()

        await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        try {
            await deleteOwnProfile(adminProfileId)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal("this profile is the only admin and can't be deleted")
        }
    })


    after(async () => await mongoose.disconnect())
})