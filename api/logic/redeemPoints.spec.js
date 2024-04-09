import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { expect } from 'chai'

import bcrypt from 'bcryptjs'

import random from './helpers/random.js'
import redeemPoints from './redeemPoints.js'
import { Profile } from '../data/models.js'

import { errors } from 'com'
const { NotFoundError, PermissionError, ContentError } = errors

describe('redeemPoints', () => {
    before(() => mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Profile.deleteMany()]))

    it('succeeds on existing session profile and profile', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin', color: { name: random.name(), code: random.name() } })

        const sessionProfileId = sessionProfile._id.toString()

        const profile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), role: 'admin', points: 100, color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        const points = random.number()

        const profileFound = await Profile.findById(profileId)

        expect(profileFound.points).to.equal(100)

        await redeemPoints(sessionProfileId, profileId, points)

        const profileFound2 = await Profile.findById(profileId)

        expect(profileFound2.points).to.equal(100 - points)
    })

    it('fails on non existing session profile', async () => {
        try {
            await redeemPoints(random.id(), random.id(), random.number())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('session profile not found')
        }
    })

    it('fails on session profile is not admin', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const sessionProfileId = sessionProfile._id.toString()

        try {
            await redeemPoints(sessionProfileId, random.id(), random.number())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(PermissionError)
            expect(error.message).to.equal('session profile is not admin')
        }
    })

    it('fails on non existing profile', async () => {
        const sessionProfile = await Profile.create({ home: random.id(), name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() }, role: 'admin' })

        const sessionProfileId = sessionProfile._id.toString()
        try {
            await redeemPoints(sessionProfileId, random.id(), random.number())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('profile not found')
        }
    })

    after(async () => await mongoose.disconnect())
})