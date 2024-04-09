import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import createRoom from './createRoom.js'
import { Home, Room } from "../data/models.js"
import { NotFoundError } from 'com/errors.js'

describe('createRoom', async () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Room.deleteMany()]))

    it('succeeds on correct data', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        const roomName = random.name()

        await createRoom(homeId, roomName)

        const room = await Room.findOne({ name: roomName })

        expect(room).to.exist
        expect(room.name).to.equal(roomName)
        expect(room.home._id.toString()).to.equal(homeId)
    })

    it('fails on no home found', async () => {
        const randomHomeId = random.id()
        const roomName = random.name()

        try {
            await createRoom(randomHomeId, roomName)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    after(async () => await mongoose.disconnect())
})