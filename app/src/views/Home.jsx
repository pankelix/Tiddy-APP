import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import session from '../logic/session'
import logic from '../logic'

import { useContext } from '../hooks'

import { Button, Container } from '../library'
import { Calendar, Profiles, Templates, Stats, Rooms } from '../components'

function Home(props) {

    const context = useContext()
    const navigate = useNavigate()

    const [homeName, setHomeName] = useState(null)
    const [profileName, setProfileName] = useState(null)
    const [stamp, setStamp] = useState(null)
    const [activeButton, setActiveButton] = useState('home')

    function handleLogoutClick() {
        try {
            logic.logoutHome()
            context.handleRole(null)
            props.onLogoutClick()
        } catch (error) {
            context.handleError(error)
        }
    }

    function handleHomeClick() {
        setActiveButton('home')
        navigate('/')
    }

    function handleProfilesClick() {
        setActiveButton('profile')
        navigate('/profiles')
    }

    function handleTasksClick() {
        setActiveButton('templates')
        navigate('/templates')
    }

    function handleStatsClick() {
        setActiveButton('stats')
        navigate('/stats')
    }

    function handleRoomsClick() {
        setActiveButton('rooms')
        navigate('/rooms')
    }

    useEffect(() => {
        (async () => {
            try {
                const home = await logic.retrieveHome()
                setHomeName(home.name)
            } catch (error) {
                context.handleError(error)
            }
            try {
                const profiles = await logic.retrieveProfiles()
                const profile = profiles.find(profile => session.profileId === profile.id)
                if (profile)
                    setProfileName(profile.name)
            } catch (error) {

            }
        })()
    }, [session.profileId])

    const handleDeletion = () => {
        props.onDeletion()
    }

    return <Container className='w-screen max-w-screen'>
        <header className='flex justify-between p-5 w-screen bg-amber-400 shadow-lg mb-[0.3rem]'>
            <h1 className='text-3xl text-white'>{homeName}</h1>
            <Button onClick={handleLogoutClick} className='bg-white py-1 px-3 rounded-md'>Logout</Button>
        </header>

        <Routes>
            <Route path='/' element={<Calendar stamp={stamp} role={props.role} onCreateNewTask={handleTasksClick} confirm={props.confirm} confirmAction={props.confirmAction} onDeletion={handleDeletion} />} />
            <Route path='/profiles' element={<Profiles stamp={stamp} role={props.role} onLogin={handleHomeClick} confirm={props.confirm} confirmAction={props.confirmAction} onDeletion={handleDeletion} />} />
            <Route path='/templates' element={<Templates stamp={stamp} role={props.role} confirm={props.confirm} confirmAction={props.confirmAction} onDeletion={handleDeletion} />} />
            {<Route path='/stats' element={<Stats stamp={stamp} role={props.role} />} />}
            {<Route path='/rooms' element={<Rooms stamp={stamp} role={props.role} confirm={props.confirm} confirmAction={props.confirmAction} onDeletion={handleDeletion} />} />}
        </Routes>

        <footer className='flex absolute bottom-0 bg-amber-400 h-[4rem] w-screen items-center justify-evenly px-[10px] shadow-lg'>
            <nav className='flex gap-[15px]'>
                <Button onClick={handleHomeClick} className={activeButton === 'home' ? 'home-footer-button' : ''}>Home</Button>

                {session.profileRole !== null && <Button onClick={handleTasksClick} className={activeButton === 'templates' ? 'home-footer-button' : ''}>Templates</Button>}

                {session.profileRole !== null && <Button onClick={handleStatsClick} className={activeButton === 'stats' ? 'home-footer-button' : ''}>Stats</Button>}

                {session.profileRole !== null && <Button onClick={handleRoomsClick} className={activeButton === 'rooms' ? 'home-footer-button' : ''}>Rooms</Button>}

                <Button onClick={handleProfilesClick} className={activeButton === 'profile' ? 'home-footer-button' : ''}>{session.profileId ? profileName : 'Profile'}</Button>
            </nav>
        </footer >
    </Container>
}

export default Home