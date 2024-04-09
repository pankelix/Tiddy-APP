import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'
import random from './helpers/random.js'
import changeProfileColor from './changeProfileColor.js'
import { Profile } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, ContentError, CredentialsError } = errors

describe('changeProfileColor', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany()]))

    it('succeeds on correct credentials', async () => {
        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        const color = { name: random.name(), code: random.name() }

        await changeProfileColor(profileId, color)

        const foundProfile = await Profile.findById(profileId)

        expect(foundProfile._doc.color.name).to.equal(color.name)
        expect(foundProfile._doc.color.code).to.equal(color.code)
    })

    it('fails on non-existing profile', async () => {
        const color = { name: random.name(), code: random.name() }
        try {
            await changeProfileColor(random.id(), color)
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    after(async () => await mongoose.disconnect())
})