import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { Login, Register, Home } from './views'

import Context from './Context'

import { errors } from 'com'
const { ContentError, DuplicityError, NotFoundError, TokenError } = errors

import { Feedback, Confirm } from './components'
import session from './logic/session'
import logic from './logic'

function App() {
  /* console.log('App') */

  const [level, setLevel] = useState(null)
  const [message, setMessage] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirm, setConfirm] = useState(false)
  const [role, setRole] = useState(logic.getProfileRole)

  const navigate = useNavigate()

  const handleRegisterShow = () => {
    navigate('/register')
    setMessage(null)
    setLevel(null)
  }
  const handleLoginShow = () => {
    navigate('/login')
    setMessage(null)
    setLevel(null)
  }
  const handleHomeShow = () => {
    navigate('/')
    setMessage(null)
    setLevel(null)
  }

  const handleError = error => {
    let level = 'fatal'
    let message = error.message

    if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
      level = 'warn'
    else if (error instanceof DuplicityError || error instanceof NotFoundError)
      level = 'error'
    else if (error instanceof TokenError) {
      logic.logoutHome(() => navigate('/login'))

      message = 'Session expired'
    }

    setLevel(level)
    console2.log(error.message, level)

    setMessage(message)
  }

  const handleFeedbackAccepted = () => {
    setMessage(null)
    setLevel(null)
  }

  const handleConfirm = (message, action) => {
    setConfirmMessage(message)
    setConfirmAction(action)
  }

  const handleConfirmAccepted = () => {
    setConfirmMessage(null)
    setConfirm(true)
  }

  const handleConfirmCanceled = () => {
    setConfirmMessage(null)
    setConfirmAction(null)
  }

  const handleConfirmToFalse = () => {
    setConfirm(false)
  }

  const handleRole = role => {
    session.profileRole = role
  }

  return <>
    <Context.Provider value={{ handleError, handleRole, handleConfirm }}>
      {message && <Feedback level={level} message={message} onAccepted={handleFeedbackAccepted} />}
      {confirmMessage && <Confirm confirmMessage={confirmMessage} onAccepted={handleConfirmAccepted} onCanceled={handleConfirmCanceled} />}
      <Routes>
        <Route path='/register' element={logic.isUserLoggedIn() ? <Navigate to='/' /> : <Register onLoginClick={handleLoginShow} onSuccess={handleLoginShow} />} />
        <Route path='/login' element={logic.isUserLoggedIn() ? <Navigate to='/' /> : <Login onRegisterClick={handleRegisterShow} onSuccess={handleHomeShow} />} />
        <Route path='/*' element={logic.isUserLoggedIn() ? <Home onLogoutClick={handleLoginShow} role={role} confirm={confirm} confirmAction={confirmAction} onDeletion={handleConfirmToFalse} /> : <Navigate to='/login' />} />
      </Routes>
    </Context.Provider>
  </>
}

export default App
