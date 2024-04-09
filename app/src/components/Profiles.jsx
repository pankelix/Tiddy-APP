import { Profile } from '../components'
import { Container, Form, Input, Button } from '../library'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useContext } from '../hooks'
import defaultColors from 'com/defaultColors'

import session from '../logic/session'
import logic from '../logic'
import deleteProfile from '../logic/deleteProfile'

function Profiles(props) {
    const context = useContext()
    const navigate = useNavigate()
    const colors = defaultColors

    const [profiles, setProfiles] = useState([])
    const [activeProfileId, setActiveProfileId] = useState(null)
    const [name, setName] = useState(null)
    const [palette, setPalette] = useState([])
    const [chosenColor, setChosenColor] = useState(null)
    const [usedColors, setUsedColors] = useState([])
    const [view, setView] = useState(null)

    const refreshProfiles = async () => {
        try {
            const profiles = await logic.retrieveProfiles()
            profiles.forEach(profile => {
                let newColor = profile.color.code
                setUsedColors(oldColors => [...oldColors, newColor])
            })
            setProfiles(profiles)
        } catch (error) {
            context.handleError(error)
        }
    }

    useEffect(() => {
        /* console.log('Profiles effect') */

        refreshColors()
        refreshProfiles()
    }, [props.stamp])

    const refreshColors = async () => {
        try {
            setPalette(colors)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleProfileClick = async (profileName) => {
        let name = profileName.target.firstChild.data
        try {
            setName(name)
            setView('login-profile-view')
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleLoginProfileSubmit = (event) => {
        event.preventDefault()
        const digit1 = event.target.digit1.value
        const digit2 = event.target.digit2.value
        const digit3 = event.target.digit3.value
        const digit4 = event.target.digit4.value

        const pincode = digit1 + digit2 + digit3 + digit4

        return (async () => {
            try {
                await logic.loginProfile(name, pincode)
                const role = await logic.retrieveRole()
                if (role === 'admin')
                    context.handleRole('admin')
                else
                    context.handleRole('user')
                props.onLogin('home')
                setView(null)
            } catch (error) {
                context.handleError(error)
            }
        })()
    }

    const handleEditProfileClick = () => {
        setView('edit-profile-view')
    }

    const handleManageProfilesClick = () => {
        setView('manage-profiles-view')
    }

    const handleManageProfileSubmit = async (event) => {
        event.preventDefault()

        const role = event.target.querySelector('Input[list="roles"]').value
        try {
            await logic.editRole(activeProfileId, role)
            refreshProfiles()
            context.handleRole(role)
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleActiveProfileClick = (profileId) => {
        setActiveProfileId(profileId)
    }

    const handleDeleteProfileClick = async (profileId) => {
        setActiveProfileId(profileId)
        context.handleConfirm('Are you sure you want to delete this profile?', 'deleteProfile')
    }

    useEffect(() => {
        const deleteProfile = async () => {
            try {
                if (props.confirm && props.confirmAction === 'deleteProfile') {
                    await logic.deleteProfile(activeProfileId)
                    refreshProfiles()
                    setView(null)
                }
            } catch (error) {
                context.handleError(error)
            }
            props.onDeletion()
        }
        deleteProfile()
    }, [props.confirm])

    const handleDeleteOwnProfileClick = async () => {
        context.handleConfirm('Are you sure you want to delete your profile?', 'deleteOwnProfile')
    }

    useEffect(() => {
        const deleteOwnProfile = async () => {
            try {
                if (props.confirm && props.confirmAction === 'deleteOwnProfile') {
                    await logic.deleteOwnProfile()
                    refreshProfiles()
                    session.profileId = null
                    context.handleRole(null)
                }
            } catch (error) {
                context.handleError(error)
            }
            props.onDeletion()
            setView(null)
        }

        deleteOwnProfile()
    }, [props.confirm])

    const handleNewProfileClick = () => {
        setView('new-profile-view')
    }

    const handleNewProfileSubmit = async (event) => {
        event.preventDefault()
        const name = event.target.name.value

        const creationDigit1 = event.target.creationDigit1.value
        const creationDigit2 = event.target.creationDigit2.value
        const creationDigit3 = event.target.creationDigit3.value
        const creationDigit4 = event.target.creationDigit4.value

        const pincode = creationDigit1 + creationDigit2 + creationDigit3 + creationDigit4

        try {
            await logic.registerProfile(name, pincode, chosenColor)
            refreshProfiles()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleCancelClick = () => {
        setView('null')
    }

    const handleChangeColorClick = () => {
        setView('change-color-view')
    }

    const handleColorClick = (color) => {
        setChosenColor(color)
    }

    const handleChooseColorClick = async () => {
        try {
            await logic.changeProfileColor(chosenColor)
            refreshProfiles()
            setChosenColor(null)
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleChangePincodeClick = () => {
        setView('change-pincode-view')
    }

    const handleChangePincodeSubmit = async (event) => {
        event.preventDefault()
        const oldDigit1 = event.target.oldDigit1.value
        const oldDigit2 = event.target.oldDigit2.value
        const oldDigit3 = event.target.oldDigit3.value
        const oldDigit4 = event.target.oldDigit4.value

        const newDigit1 = event.target.newDigit1.value
        const newDigit2 = event.target.newDigit2.value
        const newDigit3 = event.target.newDigit3.value
        const newDigit4 = event.target.newDigit4.value

        const oldPincode = oldDigit1 + oldDigit2 + oldDigit3 + oldDigit4
        const newPincode = newDigit1 + newDigit2 + newDigit3 + newDigit4

        try {
            await logic.changePincode(oldPincode, newPincode)
            refreshProfiles()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    /* const handleChangePictureClick = () => {
        setView('change-picture-view')
    } */

    /* const handleImageSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const image = formData.get('image')
        try {
            await logic.uploadAvatar(image)
            setSelectedImage(null)
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    } */

    return <Container className='px-[1rem] w-screen'>
        <article className='flex mb-[1rem] ml-[0.2rem]'>
            {profiles.length > 0 && !session.profileId && <h3 key={'login-message'} className='font-bold text-xl mt-[2rem]'>Please, click on your name to log in</h3>}
        </article>

        <article className='flex flex-col max-h-[33rem] overflow-y-auto'>
            {session.profileId && profiles.map(profile => session.profileId === profile.id ? <aside key={profile.id} className='flex gap-[1rem]'><Button onClick={handleProfileClick}><h4 profile={profile} className='font-bold text-xl mb-[2rem]'>Hello {profile.name}</h4></Button> <Button style={{ backgroundColor: profile.color.code }} className={'w-7 h-7 rounded-full'}></Button></aside> : '')}
            <article className='flex justify-center gap-[2rem] mb-[2rem]'>
                {session.profileRole === 'admin' && profiles.length > 1 ? <Button onClick={handleManageProfilesClick} className='form-submit-button'>Manage profiles</Button> : ''}
                {session.profileRole !== null ? <Button onClick={handleEditProfileClick} className='form-submit-button'>Edit your profile</Button> : ''}
            </article>

            {session.profileId && profiles.length > 1 ? <h4 className='text-xl font-bold'>Click to log in to another profile</h4> : ''}
            {profiles.length > 0 ? profiles.map(profile => session.profileId !== profile.id ? <Profile onProfileClick={handleProfileClick} onProfileDeleteClick={(profileId) => handleDeleteProfileClick(profileId)} key={profile.id} profile={profile} /> : '') : <h4 className='text-xl font-bold'>No profiles yet, create your profile clicking the + below</h4>}
        </article>



        {view === 'login-profile-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleLoginProfileSubmit} id='login-profile-form'>
                        <div className='flex flex-col items-center mt-[1rem] gap-[1.5rem]'>
                            <h3>Logging to {name}</h3>

                            <p className='text-xl font-bold'>Pin code</p>

                            <div className='flex gap-[1rem]'>
                                <Input type='number' min='0' max='9' id='digit1' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='digit2' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='digit3' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='digit4' placeholder='-' className='pincode-digit'></Input>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className='close-submit-buttons-container'>
                    <Button form='login-profile-form' type='submit' className='form-submit-button'>Submit</Button>

                    <Button type='button' onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        {view === 'edit-profile-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container'>
                    {/* <Button onClick={handleChangePictureClick}>Change picture</Button> */}
                    <Button onClick={handleChangeColorClick} className='modal-border-button'>Change profile color</Button>
                    <Button onClick={handleChangePincodeClick} className='modal-border-button'>Change pincode</Button>
                    <Button onClick={handleDeleteOwnProfileClick} className='modal-border-button'>Delete profile</Button>
                </div>

                <div className='close-submit-buttons-container'>
                    <Button type='button' onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        {/* {view === 'change-picture-view' && <article>
            <Form onSubmit={handleImageSubmit}>
                <Input name='image' type='file' accept='image/*'></Input>
                <Button type='submit'>Upload image</Button>
            </Form>
        </article>} */}

        {view === 'change-color-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container grid grid-cols-3 gap-4'>
                    {palette.map(color => !usedColors.includes(color.code) ? <Button key={color.code} onClick={() => handleColorClick(color)} style={{ backgroundColor: color.code, opacity: chosenColor === color ? 1 : 0.5 }} className='ml-[1.1rem] h-12 w-12'></Button> : '')}
                </div>

                <div className='close-submit-buttons-container'>
                    <Button onClick={handleChooseColorClick} className='form-submit-button'>Choose color</Button>
                    <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        {view === 'change-pincode-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleChangePincodeSubmit} id='change-pincode-form'>
                        <div className='flex flex-col items-center mt-[2rem] gap-[1.5rem]'>
                            <p className='text-xl font-bold'>Old pin code</p>
                            <div className='flex gap-[1rem]'>
                                <Input type='number' min='0' max='9' id='oldDigit1' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='oldDigit2' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='oldDigit3' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='oldDigit4' placeholder='-' className='pincode-digit'></Input>
                            </div>

                            <p className='text-xl font-bold'>New pin code</p>
                            <div className='flex gap-[1rem]'>
                                <Input type='number' min='0' max='9' id='newDigit1' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='newDigit2' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='newDigit3' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='newDigit4' placeholder='-' className='pincode-digit'></Input>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className='close-submit-buttons-container'>
                    <Button form='change-pincode-form' type='submit' className='form-submit-button'>Submit</Button>
                    <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        {view === 'manage-profiles-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg p-5'>
                {<Form onSubmit={handleManageProfileSubmit} id='manage-profile-form'>
                    <aside className='modal-border-button-container items-center max-h-[15rem] overflow-y-auto'>
                        {profiles.map(profile => profile.id !== session.profileId ? <Button key={profile.id} type='button' style={{ borderWidth: activeProfileId === profile.id ? '3px' : '1px' }} onClick={() => handleActiveProfileClick(profile.id)} className='modal-border-button'>{profile.name}</Button> : '')}
                    </aside>

                    <Input list='roles' placeholder='Choose new role' className='entrance-input mb-[2rem]'></Input>
                    <datalist id='roles'>
                        <option value='admin' />
                        <option value='user' />
                    </datalist>
                </Form>}

                <div className='close-submit-buttons-container justify-center mb-[2rem]'>
                    <Button form='manage-profile-form' type='submit' className='form-submit-button text-base'>Change Role</Button>
                </div>
                <div className='close-submit-buttons-container'>
                    <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        <article className='plus-button'>
            <Button onClick={handleNewProfileClick}>
                ➕
            </Button>
        </article>

        {view === 'new-profile-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleNewProfileSubmit} id='new-profile-form'>

                        <Input id='name' type='text' placeholder='Profile name' className='entrance-input'></Input>

                        <div className='flex flex-col items-center mt-[2rem] gap-[1.5rem]'>
                            <p className='text-xl font-bold'>Pin code</p>
                            <div className='flex gap-[1rem]'>
                                <Input type='number' min='0' max='9' id='creationDigit1' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='creationDigit2' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='creationDigit3' placeholder='-' className='pincode-digit'></Input>
                                <Input type='number' min='0' max='9' id='creationDigit4' placeholder='-' className='pincode-digit'></Input>
                            </div>
                        </div>

                        <div className='flex flex-col items-center mt-[2rem] mb-[-3rem] '>
                            <p className='text-xl font-bold'>Choose color</p>
                            <div className='modal-border-button-container grid grid-cols-3 gap-4 max-h-[15rem] overflow-y-auto px-2'>
                                {palette.map(color => !usedColors.includes(color.code) ? <Button type='button' key={color.code} onClick={() => handleColorClick(color)} style={{ backgroundColor: color.code, opacity: chosenColor === color ? 1 : 0.5 }} className='h-12 w-12'></Button> : '')}
                            </div>
                        </div>
                    </Form>
                </div>

                <div className='close-submit-buttons-container'>
                    <Button form='new-profile-form' type='submit' className='form-submit-button'>Submit</Button>
                    <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}
    </Container >
}

export default Profiles