import mongoose from 'mongoose'
import { expect } from 'chai'

import { weekStart } from '@formkit/tempo'
import random from './helpers/random.js'
import retrieveTasks from './retrieveTasks.js'
import { Home, Task, Template, Profile } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError } = errors

describe('retrieveTasks', () => {
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

        const task1 = await Task.create({ home: homeId, template: templateId, assignee: random.id(), date: weekStart(new Date(), 1) })
        const task2 = await Task.create({ home: homeId, template: templateId, assignee: profileId, date: weekStart(new Date(), 1) })

        const retrievedTasks = await retrieveTasks(homeId, 0)

        expect(retrievedTasks.length).to.equal(8)
        expect(retrievedTasks).to.deep.equal(retrievedTasks.sort((a, b) => a.date - b.date))
        retrievedTasks.forEach(task => {
            expect(task.home.toString()).to.equal(homeId)
            expect(task.template._id.toString()).to.equal(templateId)
            expect(task._id).to.be.undefined
            expect(task.done).to.be.false
            expect(task.delay).to.equal(0)
            expect(task.oldId).to.be.undefined
        })
        expect(retrievedTasks.find(task => task.assignee._id.toString() === profileId)).to.exist
    })

    it('fails on non-existing home', async () => {
        try {
            await retrieveTasks(random.id())
            throw new Error('should not reach this point')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.equal('home not found')
        }
    })

    after(async () => await mongoose.disconnect())
})