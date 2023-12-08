import { FormEvent } from 'react'
import { HubInvokeMethodsEnum } from '../enums'
import { useHubInvokeMethods } from '../hooks/useHubInvokeMethods'
import { URL_PARAM_ROOM } from '../constants'
import { useMessage } from '../hooks/useMessage'
import { getUrlParam, updateUrlToOriginWithRefresh } from '../helpers'

type FormProps = {
    roomName: { value: string }
    userName: { value: string }
}

export default function InitialFormView() {
    const { invokeHubMethod } = useHubInvokeMethods()
    const { message } = useMessage()

    const urlParamRoomId = getUrlParam(URL_PARAM_ROOM)

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps

        if (urlParamRoomId) {
            invokeHubMethod(
                HubInvokeMethodsEnum.CreateUserAndJoinRoom,
                urlParamRoomId,
                target.userName.value
            )
        }
        else {
            invokeHubMethod(
                HubInvokeMethodsEnum.CreateUserAndRoom,
                target.roomName.value,
                target.userName.value
            )
        }
    }

    const handleCreateNewRoom = () => {
        updateUrlToOriginWithRefresh()
    }

    return (
        <div className={'user-info-container user-info-container-out-game'}>
            <form onSubmit={handleFormSubmit}>
                <div className='user-form-container'>
                    {!urlParamRoomId && (
                        <div className='label-input-container'>
                            <label htmlFor="roomName">Room:</label>
                            <input id='roomName' type='text' name='roomName' />
                        </div>
                    )}
                    <div className='label-input-container'>
                        <label htmlFor="userName">User:</label>
                        <input id='userName' type='text' name='userName' />
                    </div>
                    <button type='submit'>Get in</button>
                    {urlParamRoomId && (
                        <button type='button' onClick={handleCreateNewRoom}>Create new room</button>
                    )}
                </div>
            </form>
            {message && <span><b>{message}</b></span>}
        </div>
    )
}