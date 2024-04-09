import mongoose from 'mongoose'
import { expect } from 'chai'
import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import { Home, Profile } from '../data/models.js'

import { errors } from 'com'
import authenticateProfile from './authenticateProfile.js'
const { NotFoundError, CredentialsError } = errors

describe('authenticateProfile', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Profile.deleteMany()]))

    it('succeeds on correct credentials', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const hash = await bcrypt.hash(password, 8)

        const home = await Home.create({ name, email, password: hash })

        const homeId = home.id

        const profileName = random.name()
        const pincode = random.pincode()
        const hash2 = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: homeId, name: profileName, pincode: hash2 })

        const profileId = await authenticateProfile(homeId, profileName, pincode)

        expect(profileId).to.be.a('string')
        expect(profileId).to.have.lengthOf(24)
        expect(profileId).to.equal(profile.id)
    })

    it('fails on no home found', async () => {
        const randomHomeId = random.id()
        const name = random.name()
        const pincode = random.pincode()

        try {
            await authenticateProfile(randomHomeId, name, pincode)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    it('fails on wrong pincode', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home.id

        const profileName = random.name()
        const pincode = random.pincode()
        const hash2 = await bcrypt.hash(pincode, 8)

        await Profile.create({ home: homeId, name: profileName, pincode: hash2 })

        try {
            await authenticateProfile(homeId, profileName, random.pincode())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.equal('wrong pincode')
        }
    })

    after(async () => await mongoose.disconnect())
})
