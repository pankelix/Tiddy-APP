import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

import { addDay, weekStart, weekEnd, dayEnd } from '@formkit/tempo'

import { Home, Task } from '../data/models.js'

function retrieveTasks(homeId, week) {
    validate.id(homeId, 'home id')

    return (async () => {
        // Comprobaciones de seguridad
        let home
        try {
            home = await Home.findById(homeId).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        if (!home)
            throw new NotFoundError('home not found')

        // Calcular la semana que queremos traer
        const referenceDate = addDay(new Date(), week * 7)

        const startOfCurrentWeek = weekStart(referenceDate, 1)

        const endOfCurrentWeek = weekEnd(referenceDate, 1)

        // Traer todas las tareas en esa semana
        let tasks
        try {
            tasks = await Task.find({ home: homeId }).populate('template', '-__v').select('-__v').sort({ date: 1 }).lean()
        } catch (error) {
            throw new SystemError(error.message)
        }

        // Tasks y echoes
        let tasksAndEchoes = []

        tasks.forEach(task => {
            // Tareas completadas y que entran en la semana de referencia
            if (task.done === true && task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
                tasksAndEchoes.push({ ...task })

            // Tareas materializadas que entran en la semana de referencia
            if (task.oldId && task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
                tasksAndEchoes.push({ ...task })

            // Para el resto de tareas
            if (task.done === false && !task.oldId) {
                // Encuentro las tareas cuyo id coincida con el oldId de una tarea materializada
                const existingEcho = tasksAndEchoes.find(echo => echo._id ? echo._id === task.oldId : null)

                // Si lo encuentra, sustituyo esa tarea para evitar duplicados
                if (existingEcho) {
                    const index = tasksAndEchoes.indexOf(existingEcho)
                    tasksAndEchoes.splice(index, 1)
                }

                // Si una tarea de la base de datos está dentro de la semana de referencia
                if (task.date >= startOfCurrentWeek && task.date <= endOfCurrentWeek)
                    tasksAndEchoes.push({ ...task })

                // Aqui creo los echoes
                let currentDate = new Date(task.date)
                let idCounter = 0

                // Mientras la fecha de la tarea no supere el final del week (por ponerle un final al while)
                while (currentDate <= endOfCurrentWeek) {
                    // Sumo la periodicidad a la fecha, para tener la fecha del primer echo
                    currentDate = addDay(currentDate, task.template.periodicity)
                    // Si este echo entra dentro de la semana de referencia
                    if (currentDate >= startOfCurrentWeek && currentDate <= endOfCurrentWeek) {
                        const taskEcho = { ...task, date: new Date(currentDate), assignee: '', _id: task._id + '_' + idCounter, done: false, delay: 0 }

                        // Para asegurar que solo entren echoes que son iguales o posteriores a la fecha de la tarea original
                        if (taskEcho.date >= task.date) {
                            tasksAndEchoes.push(taskEcho)
                            idCounter++
                        }
                    }
                }
            }
        })

        // Limpiar las tareas y los echoes
        tasksAndEchoes.forEach(task => {
            task.id = task._id.toString()
            delete task._id

            task.date = dayEnd(task.date)
        })

        // Ordenar las tareas y los echoes por fecha
        tasksAndEchoes.sort((a, b) => a.date - b.date)

        return tasksAndEchoes
    })()
}

export default retrieveTasks