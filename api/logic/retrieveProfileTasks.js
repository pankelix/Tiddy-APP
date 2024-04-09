import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { addDay, weekStart, weekEnd, dayEnd } from '@formkit/tempo'

import { Home, Task } from '../data/models.js'

function retrieveProfileTasks(homeId, profileId, week) {
    validate.id(homeId, 'home id')
    validate.id(profileId, 'profile id')

    return (async () => {

        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        const referenceDate = addDay(new Date(), week * 7)

        const startOfCurrentWeek = weekStart(referenceDate, 1)

        const endOfCurrentWeek = weekEnd(referenceDate, 1)

        // traer todas las tareas
        let tasks
        try {
            tasks = await Task.find({
                home: homeId, $or: [
                    { assignee: profileId },
                    { assignee: { $exists: false } }
                ]
            }).populate('template', '-__v').select('-__v').sort({ date: 1 }).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        let tasksAndEchoes = []

        tasks.forEach(task => {
            if (task.done === true && task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
                tasksAndEchoes.push({ ...task })

            if (task.oldId && task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
                tasksAndEchoes.push({ ...task })

            if (task.done === false && !task.oldId) {
                const existingEcho = tasksAndEchoes.find(echo => echo._id ? echo._id === task.oldId : null)

                if (existingEcho) {
                    const index = tasksAndEchoes.indexOf(existingEcho)
                    tasksAndEchoes.splice(index, 1)
                }

                if (task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
                    tasksAndEchoes.push({ ...task })

                let currentDate = new Date(task.date)
                let idCounter = 0

                while (currentDate <= endOfCurrentWeek) {
                    currentDate = addDay(currentDate, task.template.periodicity)
                    if (currentDate >= startOfCurrentWeek && currentDate <= endOfCurrentWeek) {
                        const taskEcho = { ...task, date: new Date(currentDate), assignee: '', _id: task._id + '_' + idCounter, done: false, delay: 0 }

                        if (taskEcho.date >= task.date) {
                            tasksAndEchoes.push(taskEcho)
                            idCounter++
                        }
                    }
                }
            }
        })

        // de cada tarea quiero que se haga un date = date x periodicity mientras date <= endOfCurrentWeek
        // si task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek, la pusheo en un nuevo array
        // devuelvo este nuevo array

        /* let tasks
        try {
            tasks = await Task.find({ home: homeId, date: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek } }).populate('template', '-__v').select('-__v').sort({ date: 1 }).lean()
        } catch (error) {
            throw new SystemError(error.message)
        } */

        tasksAndEchoes.forEach(task => {
            task.id = task._id.toString()
            delete task._id

            task.date = dayEnd(task.date)
        })

        tasksAndEchoes.sort((a, b) => a.date - b.date)

        /* let duplicatedTasks = tasks.map(task => ({ ...task, date: new Date(task.date) }))
        let newTasks = []
        duplicatedTasks.forEach(task => {
            task.date = addDay(new Date(task.date), task.template.periodicity)
            task.assignee = ''
            //if (task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
            newTasks.push(task)
        })

        const allTasks = [...tasks, ...newTasks].sort((a, b) => a.date - b.date);

        return allTasks */

        return tasksAndEchoes
    })()
}

export default retrieveProfileTasks