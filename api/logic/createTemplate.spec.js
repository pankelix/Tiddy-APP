import mongoose from 'mongoose'
import { expect } from 'chai'
import { dayStart } from '@formkit/tempo'

import random from './helpers/random.js'
import createTemplate from './createTemplate.js'
import { Home, Room, Template } from "../data/models.js"
import { NotFoundError, ContentError } from 'com/errors.js'

describe('createTemplate', async () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Room.deleteMany(), Template.deleteMany()]))

    it('succeeds on correct data (week)', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        let room = await Room.create({ home: homeId, name: random.name() })

        const roomId = room._id.toString()

        let periodicityNumber = Math.random().toString().slice(4, 5)
        periodicityNumber = Number(periodicityNumber.replace(0, 1))
        const periodicityRange = 'week'
        const rooms = [roomId]
        let points = Math.random().toString().slice(4, 5)
        points = Number(points.replace(0, 1))

        await createTemplate(homeId, name, periodicityNumber, periodicityRange, rooms, points)

        try {
            const template = await Template.findOne({ home: homeId })

            expect(template).to.exist
            expect(template.home._id.toString()).to.equal(homeId)
            expect(template.name).to.equal(name)
            expect(template.periodicity).to.equal(periodicityNumber * 7)
            expect(template.points).to.equal(points)
            expect(template.rooms.length).to.equal(1)
            expect(template.rooms[0]._id.toString()).to.equal(roomId)
        } catch (error) {
            throw new Error('should not reach this point')
        }
    })

    it('succeeds on correct data (day)', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        let room = await Room.create({ home: homeId, name: random.name() })

        const roomId = room._id.toString()

        let periodicityNumber = Math.random().toString().slice(4, 5)
        periodicityNumber = Number(periodicityNumber.replace(0, 1))
        const periodicityRange = 'day'
        const rooms = [roomId]
        let points = Math.random().toString().slice(4, 5)
        points = Number(points.replace(0, 1))

        await createTemplate(homeId, name, periodicityNumber, periodicityRange, rooms, points)

        try {
            const template = await Template.findOne({ home: homeId })

            expect(template).to.exist
            expect(template.home._id.toString()).to.equal(homeId)
            expect(template.name).to.equal(name)
            expect(template.periodicity).to.equal(periodicityNumber)
            expect(template.points).to.equal(points)
            expect(template.rooms.length).to.equal(1)
            expect(template.rooms[0]._id.toString()).to.equal(roomId)
        } catch (error) {
            throw new Error('should not reach this point')
        }
    })

    it('fails on periodicity = 0', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        let periodicityNumber = 0
        const periodicityRange = 'week'
        const rooms = [random.id(), random.id()]
        let points = Math.random().toString().slice(4, 5)
        points = Number(points.replace(0, 1))

        try {
            await createTemplate(homeId, name, periodicityNumber, periodicityRange, rooms, points)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal("periodicity can't be 0")
        }

    })

    it('fails on no home found', async () => {
        const randomHomeId = random.id()

        const name = random.name()
        let periodicityNumber = Math.random().toString().slice(4, 5)
        periodicityNumber = Number(periodicityNumber.replace(0, 1))
        const periodicityRange = 'day'
        const rooms = [random.id(), random.id()]
        let points = Math.random().toString().slice(4, 5)
        points = Number(points.replace(0, 1))

        try {
            await createTemplate(randomHomeId, name, periodicityNumber, periodicityRange, rooms, points)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    it('fails on no rooms found', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()
        let periodicityNumber = Math.random().toString().slice(4, 5)
        periodicityNumber = Number(periodicityNumber.replace(0, 1))
        const periodicityRange = 'day'
        const rooms = []
        let points = Math.random().toString().slice(4, 5)
        points = Number(points.replace(0, 1))

        try {
            await createTemplate(homeId, name, periodicityNumber, periodicityRange, rooms, points)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('rooms not found')
        }
    })

    it('fails on no room found', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        let home = await Home.create({ name, email, password })

        const homeId = home._id.toString()
        let periodicityNumber = Math.random().toString().slice(4, 5)
        periodicityNumber = Number(periodicityNumber.replace(0, 1))
        const periodicityRange = 'day'
        const rooms = [random.id(), random.id()]
        let points = Math.random().toString().slice(4, 5)
        points = Number(points.replace(0, 1))

        try {
            await createTemplate(homeId, name, periodicityNumber, periodicityRange, rooms, points)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('room not found')
        }

    })

    after(async () => await mongoose.disconnect())
})