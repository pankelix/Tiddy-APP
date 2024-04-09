import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import retrieveProfiles from './retrieveProfiles.js'
import { Home, Profile } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveProfiles', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Profile.deleteMany()]))

    it('succeeds on existing home and profile', async () => {
        const home = await Home.create({ name: random.name(), email: random.email(), password: random.password() })

        const homeId = home._id.toString()

        const name = random.name()

        const profile = await Profile.create({ home: homeId, name: name, pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        const retrievedProfile = await retrieveProfiles(homeId, profileId, 1)

        expect(retrievedProfile[0].home.toString()).to.equal(homeId)
        expect(retrievedProfile[0].name).to.be.a('string')
        expect(retrievedProfile[0].name).to.equal(name)
        expect(retrievedProfile[0]._id).to.be.undefined
        expect(retrievedProfile[0].pincode).to.be.undefined
        expect(retrievedProfile[0].role).to.equal('user')
        expect(retrievedProfile[0].role).to.be.a('string')
        expect(retrievedProfile[0].points).to.equal(0)
        expect(retrievedProfile[0].points).to.be.a('number')
    })

    it('fails on non-existing home', async () => {
        try {
            await retrieveProfiles(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    after(async () => await mongoose.disconnect())
})