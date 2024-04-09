import mongoose from 'mongoose'
import { expect } from 'chai'

import { weekStart } from '@formkit/tempo'
import random from './helpers/random.js'
import retrieveProfileTasks from './retrieveProfileTasks.js'
import { Home, Profile, Task, Template } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveProfileTasks', () => {
    before(async () => await mongoose.connect('mongodb://127.0.0.1:27017/spec'))

    beforeEach(() => Promise.all([Home.deleteMany(), Template.deleteMany(), Task.deleteMany()]))

    it('succeeds on existing home and task', async () => {
        const home = await Home.create({ name: random.name(), email: random.email(), password: random.password() })

        const homeId = home._id.toString()

        const profile = await Profile.create({ home: homeId, name: random.name(), pincode: random.pincode(), color: { name: random.name(), code: random.name() } })

        const profileId = profile._id.toString()

        const template1Name = random.name()

        const template = await Template.create({ home: homeId, name: template1Name, rooms: [random.id(), random.id()], periodicity: 2 })

        const templateId = template._id.toString()

        const template2Name = random.name()

        const template2 = await Template.create({ home: homeId, name: template2Name, rooms: [random.id(), random.id()], periodicity: 2 })

        const template2Id = template2._id.toString()

        const task1 = await Task.create({ home: homeId, template: templateId, assignee: random.id(), date: weekStart(new Date(), 1) })
        const task2 = await Task.create({ home: homeId, template: template2Id, assignee: profileId, date: weekStart(new Date(), 1) })

        const retrievedTasks = await retrieveProfileTasks(homeId, profileId, 0)

        expect(retrievedTasks.length).to.equal(4)
        expect(retrievedTasks[0].home.toString()).to.equal(homeId)
        expect(retrievedTasks[0].template._id.toString()).to.equal(template2Id)
        expect(retrievedTasks[0].assignee.toString()).to.equal(profileId)
        expect(retrievedTasks[0].done).to.be.false
        expect(retrievedTasks[0].delay).to.equal(0)
        expect(retrievedTasks[0].oldId).to.be.undefined
        expect(retrievedTasks).to.not.include(task1)
    })

    it('fails on non-existing home', async () => {
        try {
            await retrieveProfileTasks(random.id(), random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    after(async () => await mongoose.disconnect())
})