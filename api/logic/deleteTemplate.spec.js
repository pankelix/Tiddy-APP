import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import deleteTemplate from './deleteTemplate.js'
import { Profile, Template, Task } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('deleteTemplate', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing profile and template', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()
        const name = random.name()

        const template = await Template.create({ home: random.id(), name: name, rooms: [random.id(), random.id()] })

        expect(template).to.exist
        expect(template.name).to.equal(name)

        const templateId = template._id.toString()

        const task = await Task.create({ home: random.id(), template: templateId, assignee: random.id() })

        expect(task).to.exist
        expect(task.template._id.toString()).to.equal(templateId)

        try {
            const value = await deleteTemplate(profileId, templateId)
            expect(value).to.be.undefined
            const templateToNotFind = await Template.findById(templateId)
            expect(templateToNotFind).to.be.null
            const taskToNotFind = await Task.findOne({ template: templateId })
            expect(taskToNotFind).to.be.null
        } catch (error) {
            throw new Error(error)
        }
    })

    it('fails on non existing profile', async () => {
        try {
            await deleteTemplate(random.id(), random.id())
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
            await deleteTemplate(profileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('profile is not admin')
        }
    })

    it('fails on non existing template', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        try {
            await deleteTemplate(profileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('template not found')
        }

        after(async () => await mongoose.disconnect())
    })
})