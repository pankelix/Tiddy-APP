import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'
import random from './helpers/random.js'
import changePincode from './changePincode.js'
import { Profile } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, ContentError, CredentialsError } = errors

describe('changePincode', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany()]))

    it('succeeds on correct credentials', async () => {
        const oldPincode = random.pincode()

        const hash = await bcrypt.hash(oldPincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()
        const match = await bcrypt.compare(oldPincode, profile.pincode)

        expect(match).to.be.true

        const newPincode = random.pincode()

        await changePincode(profileId, oldPincode, newPincode)

        const foundProfile = await Profile.findById(profileId)

        const match2 = await bcrypt.compare(newPincode, foundProfile.pincode)

        expect(match2).to.be.true
    })

    it('fails on old pincode and new pincode are the same', async () => {
        const pincode = random.pincode()

        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()
        const match = await bcrypt.compare(pincode, profile.pincode)

        expect(match).to.be.true

        try {
            await changePincode(profileId, pincode, pincode)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(ContentError)
            expect(error.message).to.equal('old pincode and new pincode are equal')
        }
    })

    it('fails on non-existing profile', async () => {
        try {
            await changePincode(random.id(), random.pincode(), random.pincode())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    it('fails on wrong pincode', async () => {
        const pincode = random.pincode()

        const hash = await bcrypt.hash(pincode, 8)

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: hash, color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()
        const match = await bcrypt.compare(pincode, profile.pincode)

        expect(match).to.be.true

        try {
            await changePincode(profileId, random.pincode(), random.pincode())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.equal('wrong pincode')
        }
    })

    after(async () => await mongoose.disconnect())
})