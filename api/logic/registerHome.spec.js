import mongoose from 'mongoose'
import { expect } from 'chai'
import bcrypt from 'bcryptjs'

import { Home } from '../data/models.js'
import registerHome from './registerHome.js'

import random from './helpers/random.js'
import { errors } from 'com'
const { DuplicityError } = errors

describe('registerHome', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(async () => await Home.deleteMany())

    it('succeeds on correct credentials', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        await registerHome(name, email, password)

        const home = await Home.findOne({ email })

        expect(home).to.exist
        expect(home.name).to.equal(name)
        expect(home.email).to.equal(email)

        const match = await bcrypt.compare(password, home.password)

        expect(match).to.be.true
    })

    it('fails on already existing home', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        await Home.create({ name, email, password })

        try {
            await registerHome(name, email, password)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.equal('home already exists')
        }
    })

    after(async () => await mongoose.disconnect())
})