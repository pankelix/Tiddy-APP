import { validate, errors } from 'com'
const { SystemError } = errors

import session from './session'

const createTask = (templateId, date) => {
    validate.id(templateId, 'template id')
    validate.date(date)

    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ templateId, date })
    }

     return (async () => {
         let res
         try {
             res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, req)
         } catch (error) {
             throw new SystemError(error.message)
         }

         if (!res.ok) {
             let body

             try {
                 body = await res.json()
             } catch (error) {
                 throw new SystemError(error.message)
             }

             throw new errors[body.error](body.message)
         }
     })()
}

export default createTask