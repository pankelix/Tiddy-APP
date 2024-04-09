import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import retrieveRole from './retrieveRole.js'
import { Profile } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveRole', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany()]))

    it('succeeds on existing profile', async () => {
        const name = random.name()

        const profile = await Profile.create({ home: random.id(), name: name, pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        const retrievedRole = await retrieveRole(profileId)

        expect(retrievedRole).to.be.a('string')
        expect(retrievedRole).to.equal('user')
    })

    it('fails on non-existing profile', async () => {
        try {
            await retrieveRole(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    after(async () => await mongoose.disconnect())
})