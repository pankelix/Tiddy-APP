import mongoose from 'mongoose'
import { expect } from 'chai'
import bcrypt from 'bcryptjs'

import { Home, Profile } from '../data/models.js'
import registerProfile from './registerProfile.js'

import colors from 'com/defaultColors.js'
import random from './helpers/random.js'
import { errors } from 'com'
const { NotFoundError, DuplicityError } = errors

describe('registerProfile', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Profile.deleteMany()]))

    it('succeeds on correct credentials', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home._id.toString()

        const profileName = random.name()
        const pincode = random.pincode()

        const profile = await registerProfile(homeId, profileName, pincode)

        expect(profile).to.exist
        expect(profile.home._id.toString()).to.equal(homeId)
        expect(profile.name).to.equal(profileName)

        const match = await bcrypt.compare(pincode, profile.pincode)

        expect(match).to.be.true
    })

    it('fails on home not found', async () => {
        const homeId = random.id()
        const name = random.name()
        const pincode = random.pincode()

        try {
            await registerProfile(homeId, name, pincode)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    it('fails on already existing profile', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home._id.toString()
        const pincode = random.pincode()

        await Profile.create({ home: homeId, name: name, pincode: pincode })

        try {
            await registerProfile(homeId, name, pincode)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.equal('profile is not respecting unique values')
        }
    })

    it('fails on no more colors', async () => {
        const name = random.name()
        const email = random.email()
        const password = random.password()

        const home = await Home.create({ name, email, password })

        const homeId = home._id.toString()
        const pincode = random.pincode()

        try {
            for (let i = 0; i < 21; i++) {
                await registerProfile(homeId, name + ' ' + i, pincode)
            }
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('there are no more colors to pick')
        }
    })

    after(async () => await mongoose.disconnect())
})