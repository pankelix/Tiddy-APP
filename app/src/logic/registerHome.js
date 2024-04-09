import { validate, errors } from 'com'
const { SystemError } = errors

const registerHome = (name, email, password) => {
    validate.text(name, 'name')
    validate.email(email)
    validate.password(password)

    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    }

     return (async () => {
         let res
         try {
             res = await fetch(`${import.meta.env.VITE_API_URL}/homes`, req)
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

export default registerHome