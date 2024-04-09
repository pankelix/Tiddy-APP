import { useEffect, useState } from 'react'
import { useContext } from '../hooks'
import { Button, Container, Input, Form } from '../library'

import session from '../logic/session'
import logic from '../logic'

function Stats(props) {
    const context = useContext()

    const [profiles, setProfiles] = useState([])
    const [profile, setProfile] = useState(null)
    const [view, setView] = useState(null)

    const refreshProfiles = async () => {
        try {
            const profiles = await logic.retrieveProfiles()
            setProfiles(profiles)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleRedeemPointsClick = (profileId) => {
        setProfile(profileId)
        setView('redeem-points-view')
    }

    const handleRedeemPointsSubmit = async (event) => {
        event.preventDefault()
        const points = Number(event.target.points.value)
        try {
            await logic.redeemPoints(profile, points)
            refreshProfiles()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleCancelClick = () => {
        setView(null)
    }

    useEffect(() => {
        /* console.log('Stats effect') */

        refreshProfiles()
    }, [props.stamp])

    return <Container>
        <article className='flex flex-col gap-[2rem] m-[1.5rem] max-h-[40rem] overflow-y-auto'>
            {profiles.map(profile => <article key={profile.id} className='grid grid-cols-3 gap-3 align-center'>

                <h5 className='text-md font-bold'>{profile.name}</h5>
                <h5 className='text-md'>{profile.points ? `${profile.points} points` : '0 points'}</h5>

                {session.profileRole === 'admin' && profile.points !== 0 && <Button onClick={() => handleRedeemPointsClick(profile.id)} className='form-submit-button py-1 w-[6rem] h-[2rem]'>Redeem</Button>}
            </article>)}
        </article>

        {view === 'redeem-points-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleRedeemPointsSubmit} id='redeem-points-form'>
                        <Input id='points' type='number' placeholder={'Points to redeem'} required={true}></Input>
                    </Form>
                </div>
                <div className='close-submit-buttons-container'>
                    <Button form='redeem-points-form' type='submit' className='form-submit-button'>Redeem!</Button>
                    <Button type='button' onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}
    </Container>
}

export default Stats