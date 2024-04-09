import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import deleteRoom from './deleteRoom.js'
import { Profile, Room, Template } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError } = errors

describe('deleteRoom', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany(), Room.deleteMany(), Template.deleteMany()]))

    it('succeeds on existing profile and room', async () => {
        const pincode = random.pincode()
        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, role: 'admin' })

        const profileId = profile._id.toString()

        const name = random.name()

        const room = await Room.create({ home: random.id(), name: name })

        expect(room).to.exist
        expect(room.name).to.equal(name)

        const roomId = room._id.toString()

        const template = await Template.create({ home: random.id(), name: random.name(), rooms: [roomId] })

        expect(template).to.exist
        expect(template.rooms[0]._id.toString()).to.equal(roomId)

        const templateId = template._id.toString()

        try {
            const value = await deleteRoom(profileId, roomId)
            expect(value).to.be.undefined

            const roomToNotFind = await Room.findById(roomId)
            expect(roomToNotFind).to.be.null

            const templateToNotFind = await Template.findOne({ rooms: [roomId] })
            expect(templateToNotFind).to.be.null
        } catch (error) {
            throw new Error(error)
        }
    })

    it('fails on non existing profile', async () => {
        try {
            await deleteRoom(random.id(), random.id())
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
            await deleteRoom(profileId, random.id())
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
            await deleteRoom(profileId, random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('room not found')
        }

        after(async () => await mongoose.disconnect())
    })
})