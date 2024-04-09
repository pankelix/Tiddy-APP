import { useState } from 'react'
import { Button, Container } from '../library'
import session from '../logic/session'

function Profile(props) {
    const profile = props.profile

    const handleProfileClick = (profileName) => {
        props.onProfileClick(profileName)
    }

    const handleDeleteProfileClick = (profileId) => {
        props.onProfileDeleteClick(profileId)
    }

    return <Container className='flex flex-col items-center'>
        <article key={profile.id} className={`${session.profileRole === 'admin' ? 'grid grid-cols-2 gap-3': 'grid grid-cols-1 gap-3'}`}>
            <ul>
                <li>
                    <Button style={{ backgroundColor: profile.id === session.profileId ? profile.color.code : '' }} onClick={handleProfileClick} className='modal-border-button w-[10rem] my-[1rem]'>{profile.name}</Button>
                </li>
            </ul>

            {session.profileRole === 'admin' && <Button type='button' onClick={() => handleDeleteProfileClick(profile.id)} className='form-submit-button my-[1rem] p-0 w-[10rem]'>Delete</Button>}
        </article>
    </Container>
}

export default Profile