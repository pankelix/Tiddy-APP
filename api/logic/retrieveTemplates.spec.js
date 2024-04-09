import mongoose from 'mongoose'
import { expect } from 'chai'

import random from './helpers/random.js'
import retrieveTemplates from './retrieveTemplates.js'
import { Home, Template } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveTemplates', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Template.deleteMany()]))

    it('succeeds on existing home and template', async () => {
        const home = await Home.create({ name: random.name(), email: random.email(), password: random.password() })

        const homeId = home._id.toString()

        const name = random.name()

        const template = await Template.create({ home: homeId, name: name, rooms: [random.id(), random.id()] })

        const retrievedTemplates = await retrieveTemplates(homeId)

        expect(retrievedTemplates[0].home.toString()).to.equal(homeId)
        expect(retrievedTemplates[0].name).to.be.a('string')
        expect(retrievedTemplates[0].name).to.equal(name)
        expect(retrievedTemplates[0]._id).to.be.undefined
        expect(retrievedTemplates[0].periodicity).to.be.undefined
        expect(retrievedTemplates[0].points).to.be.undefined
    })

    it('fails on non-existing home', async () => {
        try {
            await retrieveTemplates(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    after(async () => await mongoose.disconnect())
})