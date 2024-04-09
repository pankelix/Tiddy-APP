import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import editTemplate from './editTemplate.js'
import { Profile, Template } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError, ContentError } = errors

describe('editTemplate', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Template.deleteMany()]))

    it('succeeds on existing profile and template (week)', async () => {
        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin' })

        const profileId = profile._id.toString()

        const homeId = random.id()

        const template = await Template.create({ home: homeId, name: random.name(), rooms: [random.id(), random.id()] })

        const templateId = template._id.toString()

        const name = random.name()
        const periodicityNumber = random.number()
        const periodicityRange = 'week'
        const rooms = [random.id(), random.id()]
        const points = random.number()

        await editTemplate(profileId, templateId, name, periodicityNumber, periodicityRange, rooms, points)

        const templateFound = await Template.findById(templateId)

        expect(templateFound._id.toString()).to.equal(templateId)
        expect(templateFound.home._id.toString()).to.equal(homeId)
        expect(templateFound.periodicity).to.equal(periodicityNumber * 7)
        expect(templateFound.rooms.length).to.equal(2)
        expect(templateFound.rooms[0]._id.toString()).to.equal(rooms[0])
        expect(templateFound.rooms[1]._id.toString()).to.equal(rooms[1])
        expect(templateFound.points).to.equal(points)
    })

    it('succeeds on existing profile and template (day)', async () => {
        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin' })

        const profileId = profile._id.toString()

        const homeId = random.id()

        const template = await Template.create({ home: homeId, name: random.name(), rooms: [random.id(), random.id()] })

        const templateId = template._id.toString()

        const name = random.name()
        const periodicityNumber = random.number()
        const periodicityRange = 'day'
        const rooms = [random.id(), random.id()]
        const points = random.number()

        await editTemplate(profileId, templateId, name, periodicityNumber, periodicityRange, rooms, points)

        const templateFound = await Template.findById(templateId)

        expect(templateFound._id.toString()).to.equal(templateId)
        expect(templateFound.home._id.toString()).to.equal(homeId)
        expect(templateFound.periodicity).to.equal(periodicityNumber)
        expect(templateFound.rooms.length).to.equal(2)
        expect(templateFound.rooms[0]._id.toString()).to.equal(rooms[0])
        expect(templateFound.rooms[1]._id.toString()).to.equal(rooms[1])
        expect(templateFound.points).to.equal(points)
    })

    it('fails on periodicity 0', async () => {
        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin' })

        const profileId = profile._id.toString()

        const homeId = random.id()

        const template = await Template.create({ home: homeId, name: random.name(), rooms: [random.id(), random.id()] })

        const templateId = template._id.toString()

        const name = random.name()
        const periodicityNumber = 0
        const periodicityRange = 'week'
        const rooms = [random.id(), random.id()]
        const points = random.number()

        try {
            await editTemplate(profileId, templateId, name, periodicityNumber, periodicityRange, rooms, points)
            throw new Error('should not reach here')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal("periodicity can't be 0")
        }
    })

    it('fails on non existing profile', async () => {
        try {
            await editTemplate(random.id(), random.id(), random.name(), random.number(), random.name(), [], random.number())
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
            await editTemplate(profileId, random.id(), random.name(), random.number(), random.name(), [], random.number())
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
            await editTemplate(profileId, random.id(), random.name(), random.number(), random.name(), [], random.number())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('template not found')
        }

        after(async () => await mongoose.disconnect())
    })
})