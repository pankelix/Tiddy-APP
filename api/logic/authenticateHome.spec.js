import mongoose from 'mongoose'
import { expect } from 'chai'
import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import { Home } from '../data/models.js'

import { errors } from 'com'
import authenticateHome from './authenticateHome.js'
const { NotFoundError, CredentialsError } = errors

describe('authenticateHome', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(async () => await Home.deleteMany())

    it('succeeds on correct credentials', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const hash = await bcrypt.hash(password, 8)

        const home = await Home.create({ name, email, password: hash })

        const homeId = await authenticateHome(email, password)

        expect(homeId).to.be.a('string')
        expect(homeId).to.have.lengthOf(24)
        expect(homeId).to.equal(home.id)
    })

    it('fails on no home found', async () => {
        const email = random.email()
        const password = random.password()

        try {
            await authenticateHome(email, password)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    it('fails on wrong password', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        await Home.create({ name, email, password })

        try {
            await authenticateHome(email, password + '-wrong')
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.equal('wrong password')
        }
    })

    after(async () => await mongoose.disconnect())
})
