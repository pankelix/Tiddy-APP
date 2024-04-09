import mongoose from 'mongoose'
import registerHome from './registerHome.js'
import registerProfile from './registerProfile.js'
import createRoom from './createRoom.js'
import createTemplate from './createTemplate.js'
import createTask from './createTask.js'
import { format, addDay } from '@formkit/tempo'

import { Home, Room, Profile, Template, Task } from '../data/models.js'

(async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/project2')
        await Home.deleteMany()
        await Room.deleteMany()
        await Profile.deleteMany()
        await Template.deleteMany()
        await Task.deleteMany()

        //Home
        let mansion
        let casoplon
        let casita
        let pisito
        try {
            mansion = await registerHome('Man Sion', 'man@sion.com', '123123123')
            casoplon = await registerHome('Ca Soplon', 'ca@soplon.com', '123123123')
            casita = await registerHome('Ca Sita', 'ca@sita.com', '123123123')
            pisito = await registerHome('Pi sito', 'pi@sito.com', '123123123')
        } catch (error) {
            console.log(error)
        }

        //Room
        let kidsBathroom
        let adultsBathroom
        let livingRoom
        let terrace
        let yard
        let kitchen
        let diningRoom
        let hall
        let kidsBedroom
        let adultsBedroom
        let office
        try {
            kidsBathroom = await createRoom(mansion.id, 'kids-bathroom')
            adultsBathroom = await createRoom(mansion.id, 'adults-bathroom')
            livingRoom = await createRoom(mansion.id, 'living-room')
            terrace = await createRoom(mansion.id, 'terrace')
            yard = await createRoom(mansion.id, 'yard')
            kitchen = await createRoom(mansion.id, 'kitchen')
            diningRoom = await createRoom(mansion.id, 'dining-room')
            hall = await createRoom(mansion.id, 'hall')
            kidsBedroom = await createRoom(mansion.id, 'kids-bedroom')
            adultsBedroom = await createRoom(mansion.id, 'adults-bedroom')
            office = await createRoom(mansion.id, 'office')
        } catch (error) {
            console.log(error)
        }

        //Profile
        let peter
        let wendy
        let michael
        let john
        let james
        try {
            peter = await registerProfile(mansion.id, 'Peter Pan', '1234', { name: 'Emerald green', code: '#2ECC71' })
            wendy = await registerProfile(mansion.id, 'Wendy Darling', '1234', { name: 'Blue', code: '#3498DB' })
            james = await registerProfile(mansion.id, 'James Hook', '1234', { name: 'Red', code: '#E74C3C' })
            michael = await registerProfile(mansion.id, 'Michael Darling', '1234', { name: 'Dark purple', code: '#8E44AD' })
            john = await registerProfile(mansion.id, 'John Darling', '1234', { name: 'Soft yellow', code: '#F1C40F' })
        } catch (error) {
            console.log(error)
        }

        //Template
        let cleanShower
        let dust
        let doDishes
        let lawnRaking
        let changeSheets
        let cleanWindow
        let cleanOven
        try {
            //homeId, name, periodicityNumber, periodicityRange, rooms, points
            cleanShower = await createTemplate(mansion.id, 'clean-shower', 1, 'week', [kidsBathroom.id, adultsBathroom.id], 15)
            dust = await createTemplate(mansion.id, 'dust', 2, 'week', [livingRoom.id, hall.id, office.id], 5)
            doDishes = await createTemplate(mansion.id, 'do-dishes', 6, 'day', [kitchen.id], 2)
            lawnRaking = await createTemplate(mansion.id, 'lawn-raking', 4, 'week', [terrace.id, yard.id], 15)
            changeSheets = await createTemplate(mansion.id, 'change-sheets', 3, 'day', [kidsBedroom.id], 2)
            cleanWindow = await createTemplate(mansion.id, 'clean window', 2, 'week', [adultsBedroom.id], 7)
            cleanOven = await createTemplate(mansion.id, 'clean-oven', 3, 'week', [kitchen.id], 10)
        } catch (error) {
            console.log(error)
        }

        //Task
        //homeId, templateId, date
        await createTask(mansion.id, cleanShower.id, format(addDay(new Date(), 0), 'YYYY-MM-DD'))
        /* await createTask(mansion.id, dust.id, format(addDay(new Date(), 1), 'YYYY-MM-DD'))
        await createTask(mansion.id, doDishes.id, format(addDay(new Date(), 2), 'YYYY-MM-DD')) */
        await createTask(mansion.id, lawnRaking.id, format(addDay(new Date(), 3), 'YYYY-MM-DD'))
        await createTask(mansion.id, changeSheets.id, format(addDay(new Date(), 4), 'YYYY-MM-DD'))
        /* await createTask(mansion.id, cleanWindow.id, format(addDay(new Date(), 5), 'YYYY-MM-DD')) */
        await createTask(mansion.id, cleanOven.id, format(addDay(new Date(), 6), 'YYYY-MM-DD'))

        console.log('database populated')

        await mongoose.disconnect()
    } catch (error) {
        console.log(error)
    }
})()