import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import retrieveHome from './retrieveHome.js'
import { Home } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveHome', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(async () => await Home.deleteMany())

    it('succeeds on existing home', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const retrievedHome = await retrieveHome(home.id)

        expect(retrievedHome.name).to.be.a('string')
        expect(retrievedHome.name).to.equal(name)
        expect(retrievedHome._id).to.be.undefined
        expect(retrievedHome.email).to.be.undefined
        expect(retrievedHome.password).to.be.undefined
    })

    it ('fails on non-existing home', async () => {
        try {
            await retrieveHome(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

        after(async () => await mongoose.disconnect())
})