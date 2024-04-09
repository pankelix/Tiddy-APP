import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'
import random from './helpers/random.js'
import editRole from './editRole.js'
import { Profile } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, PermissionError, CredentialsError } = errors

describe('editRole', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany()]))

    it('succeeds on change from user to admin', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() }, role: 'admin' })

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const sessionProfileId = sessionProfile._id.toString()
        const profileId = profile._id.toString()

        const foundProfile = await Profile.findById(profileId)

        expect(foundProfile.role).to.equal('user')

        await editRole(sessionProfileId, profileId, 'admin')

        const foundProfile2 = await Profile.findById(profileId)

        expect(foundProfile2.role).to.equal('admin')
    })

    it('succeeds on change from admin to user', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() }, role: 'admin' })

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() }, role: 'admin' })

        const sessionProfileId = sessionProfile._id.toString()
        const profileId = profile._id.toString()

        const foundProfile = await Profile.findById(profileId)

        expect(foundProfile.role).to.equal('admin')

        await editRole(sessionProfileId, profileId, 'user')

        const foundProfile2 = await Profile.findById(profileId)

        expect(foundProfile2.role).to.equal('user')
    })

    it('fails on non-existing session profile', async () => {
        try {
            await editRole(random.id(), random.id(), random.name())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('session profile not found')
        }
    })

    it('fails on session profile not being admin', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() }, role: 'user' })

        const sessionProfileId = sessionProfile._id.toString()

        try {
            await editRole(sessionProfileId, random.id(), random.name())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('session profile is not admin')
        }
    })

    it('fails on non-existing profile', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() }, role: 'admin' })

        const sessionProfileId = sessionProfile._id.toString()
        try {
            await editRole(sessionProfileId, random.id(), random.name())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    after(async () => await mongoose.disconnect())
})