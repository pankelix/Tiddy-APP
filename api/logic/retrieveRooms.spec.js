import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import retrieveRooms from './retrieveRooms.js'
import { Home, Room } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveRooms', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Room.deleteMany()]))

    it('succeeds on existing home and room', async () => {
        const home = await Home.create({ name: random.name(), email: random.email(), password: random.password() })

        const homeId = home._id.toString()
        const name = random.name()

        const room = await Room.create({ home: homeId, name: name })

        const retrievedRooms = await retrieveRooms(homeId)

        expect(retrievedRooms[0].home.toString()).to.equal(homeId)
        expect(retrievedRooms[0].name).to.be.a('string')
        expect(retrievedRooms[0].name).to.equal(name)
        expect(retrievedRooms[0]._id).to.be.undefined
    })

    it('fails on non-existing home', async () => {
        try {
            await retrieveRooms(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    after(async () => await mongoose.disconnect())
})