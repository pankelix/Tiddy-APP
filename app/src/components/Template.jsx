import { useState, useEffect } from 'react'

import { useContext } from '../hooks'

import session from '../logic/session'
import logic from '../logic'
import helper from '../logic/helpers'
import { Button, Container, Form, Input } from '../library'

function Template(props) {
    const template = props.template
    const rooms = props.rooms
    const context = useContext()

    const [view, setView] = useState()

    const handleDeleteClick = () => {
        props.onDeleteClick(template.id)
    }

    const handleEditClick = () => {
        setView('edit-click-view')
    }

    const handleTaskClick = (roomId) => {
        props.onChosenRoom(roomId)
    }

    const handleCancelClick = () => {
        setView(null)
        props.onCancelClick()
    }

    const handleEditTemplateClick = async (event) => {
        event.preventDefault()
        const name = event.target.taskName.value
        const periodicityNumber = Number(event.target.periodicityNumber.value)
        const periodicityRange = props.dayOrWeek
        const rooms = props.chosenRooms
        const points = Number(event.target.points.value)
        try {
            await logic.editTemplate(template.id, name, periodicityNumber, periodicityRange, rooms, points)
            props.onEditSuccess()
            setView(null)
        } catch (error) {
            context.handleError(error)
        }
    }

    return <Container className='border-t-2 pt-[1.5rem] border-amber-400'>
        <article>
            <h3 className='text-lg font-semibold mb-[1rem]'>{helper.arrangeText(template.name)}</h3>

            <div className='grid grid-cols-[1fr_1fr_1.5fr_1fr] gap-3 mb-[1rem]'>
                <h4 className='text-md font-semibold'>Points</h4>
                <p>{template.points}</p>
                <h4 className='text-md font-semibold'>Periodicity</h4>
                <p>{helper.arrangePeriodicity(template.periodicity)}</p>
            </div>

            <aside className='max-h-[6rem] overflow-y-auto mb-[1rem]'>
                <h4 className='text-md font-semibold'>Rooms</h4>
                {template.rooms.map(room => <p key={room._id}>{helper.arrangeText(room.name)}</p>)}
            </aside>
        </article>

        {session.profileRole === 'admin' && <aside className='flex justify-end gap-[1rem]'>
            <Button onClick={handleEditClick} className='form-submit-button'>Edit template</Button>
            <Button onClick={handleDeleteClick} className='form-submit-button'>Delete template</Button>
        </aside>}

        {view === 'edit-click-view' && <article className='modal-black-bg'>
            <div className='modal-white-bg'>
                <div className='modal-border-button-container items-center'>
                    <Form onSubmit={handleEditTemplateClick} id='edit-template-form'>
                        <p className='mt-[-1rem]'>{helper.arrangeText(template.name)}</p>

                        <Input id='taskName' defaultValue={template.name ? helper.arrangeText(template.name) : ''} type='text' required={true} placeholder={'Task name'} className='entrance-input mb-[1rem]'></Input>

                        <p>It repeats every</p>
                        <div className='flex mb-[1rem] gap-[1rem]'>
                            <Input type='number' min='1' id='periodicityNumber' placeholder='Number' required={true} className='entrance-input w-[6rem]'></Input>

                            <Button type='button' id='day' onClick={props.onSetDay} style={{ borderWidth: props.dayOrWeek === 'day' ? '3px' : '1px' }} className='modal-border-button w-[6rem]'>Days</Button>

                            <Button type='button' id='week' onClick={props.onSetWeek} style={{ borderWidth: props.dayOrWeek === 'week' ? '3px' : '1px' }} className='modal-border-button w-[6rem]'>Weeks</Button>
                        </div>

                        <p>Points</p>
                        <Input id='points' placeholder={'Points (optional)'} className='entrance-input mb-[1rem]'>Points(optional)</Input>

                        <p className='text-xl font-bold mb-[-1rem]'>Choose rooms</p>
                        <aside className='flex flex-col gap-[2rem] m-[1.5rem] h-[10rem] overflow-y-auto'>
                            {props.rooms.map(room => <Button type='button' key={room.id} style={{ borderWidth: props.chosenRooms.includes(room.id) ? '3px' : '1px' }} onClick={() => handleTaskClick(room.id)} className='modal-border-button mb-[-1rem]'>{helper.arrangeText(room.name)}</Button>)}
                        </aside>
                    </Form>
                </div>

                <div className='close-submit-buttons-container mt-[-4.5rem]'>
                    <Button type='submit' form='edit-template-form' className='form-submit-button'>Edit</Button>

                    <Button onClick={handleCancelClick} className='modal-close-button'>X</Button>
                </div>
            </div>
        </article>}
    </Container>
}

export default Template