import { FormEvent, useContext } from 'react'
import { GameContext } from '../contexts/GameContext'
import { HubInvokeMethodsEnum } from '../enums'
import { Room } from '../types'
import { useHubInvokeMethods } from '../hooks/useHubInvokeMethods'
import { useHubReceiveMethods } from '../hooks/useHubReceiveMethods'
import { URL_PARAM_ROOM } from '../constants'
import { updateUrlWithoutRefresh } from '../helpers'
import { useError } from '../hooks/useError'

type FormProps = {
    roomName: { value: string }
    userName: { value: string }
}

export default function UserForm() {
    const { setRoom } = useContext(GameContext)

    const { invokeHubMethod } = useHubInvokeMethods()
    const { createAllReceiveMethods } = useHubReceiveMethods()
    const { error } = useError()

    const urlParamRoomId = new URL(location.href).searchParams?.get(URL_PARAM_ROOM)

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps

        createAllReceiveMethods()

        if (urlParamRoomId) {
            invokeHubMethod(
                HubInvokeMethodsEnum.CreateUserAndJoinRoom,
                urlParamRoomId,
                target.userName.value
            ).then((room: Room) => {
                setRoom(room)
            })
        }
        else {
            invokeHubMethod(
                HubInvokeMethodsEnum.CreateUserAndRoom,
                target.roomName.value,
                target.userName.value
            ).then((room: Room) => {
                updateUrlWithoutRefresh(room.id)
                setRoom(room)
            })
        }
    }

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {!urlParamRoomId && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="roomName">Room:</label>
                            <input id='roomName' type='text' name='roomName' />
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="userName">User:</label>
                        <input id='userName' type='text' name='userName' />
                    </div>
                    <button type='submit'>Get in</button>
                </div>
            </form>
            {error && <span><b>{error}</b></span>}
        </>
    )
}