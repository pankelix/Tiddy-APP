import { useEffect, useState } from 'react'
import { useContext } from '../hooks'
import { Button, Container, Input, Form } from '../library'

import session from '../logic/session'
import logic from '../logic'
import helper from '../logic/helpers'

function Rooms(props) {
    const context = useContext()

    const [rooms, setRooms] = useState([])
    const [chosenRoomId, setChosenRoomId] = useState([])
    const [view, setView] = useState(null)

    const refreshRooms = async () => {
        try {
            const rooms = await logic.retrieveRooms()
            setRooms(rooms)
        } catch (error) {
            context.handleError(error)
        }
    }

    useEffect(() => {
        /* console.log('Rooms effect') */

        refreshRooms()
    }, [props.stamp])

    const handleNewRoomClick = () => {
        setView('new-room-view')
    }

    const handleCancelClick = () => {
        setView(null)
    }

    const handleNewRoomSubmit = async (event) => {
        event.preventDefault()
        const name = event.target.roomName.value
        try {
            await logic.createRoom(name)
            refreshRooms()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    const handleDeleteRoomClick = async (roomId) => {
        setChosenRoomId(roomId)
        context.handleConfirm('Are you sure you want to delete this room?', 'deleteRoom')
    }

    useEffect(() => {
        const deleteRoom = async () => {
            try {
                if (props.confirm && props.confirmAction === 'deleteRoom') {
                    await logic.deleteRoom(chosenRoomId)
                    refreshRooms()
                    setView(null)

                }
            } catch (error) {
                context.handleError(error)
            }
            props.onDeletion()
        }

        deleteRoom()
    }, [props.confirm])

    return <Container>
        {/* {rooms.length === 0 ? <h3 className='text-xl font-bold'>Please create a room clicking on the + below</h3> : ''} */}

        <article className='flex flex-col gap-[2rem] m-[1.5rem] max-h-[35rem] overflow-y-auto'>
            {rooms.map(room => <article key={room.id} className='grid grid-cols-2 gap-3'>
                <h5 className='text-xl font-bold'>{helper.arrangeText(room.name)}</h5>
                {session.profileRole === 'admin' && <Button type='button' onClick={() => handleDeleteRoomClick(room.id)} className='form-submit-button py-1 w-[10rem]'>Delete</Button>}
            </article>)}
        </article>

        {rooms.length === 0 && <article className='flex flex-col gap-[2rem] m-[1.5rem] max-h-[35rem] overflow-y-auto'>
            {session.profileRole === 'admin' && <h3 className='text-xl font-bold'>Please create a room clicking on the + below</h3>}
            {session.profileRole === 'user' && <h3 className='text-xl font-bold'>You must be admin to create a new room</h3>}
        </article>}

        {view === 'new-room-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleNewRoomSubmit} id='new-room-form'>
                        <Input id='roomName' placeholder={'New room name'} required={true} className='entrance-input'></Input>
                    </Form>
                </div>
                <div className='close-submit-buttons-container'>
                    <Button form='new-room-form' type='submit' className='form-submit-button'>Create</Button>
                    <Button type='button' onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}

        <article>
            {session.profileRole === 'admin' && <Button onClick={handleNewRoomClick} className='plus-button'>➕</Button>}
        </article>

    </Container >
}

export default Rooms