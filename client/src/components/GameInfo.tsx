import { useContext } from 'react'
import { GameContext } from '../contexts/GameContext'
import { useHubInvokeMethods } from '../hooks/useHubInvokeMethods'
import { HubInvokeMethodsEnum } from '../enums'
import { getUrlWithRoomId, updateUrlToOriginWithRefresh } from '../helpers'

export default function GameInfo() {
    const { room, user, leaveRoom } = useContext(GameContext)

    const { invokeHubMethod } = useHubInvokeMethods()

    if(!room || !user) { return }

    const handleCopyInviteLinkClick = (): void => {
        const inviteUrl = getUrlWithRoomId(room.id)
        navigator.clipboard.writeText(inviteUrl.href)
    }

    const handleLeaveRoomClick = (): void => {
        invokeHubMethod(HubInvokeMethodsEnum.LeaveRoom).finally(() => {
            leaveRoom()
            updateUrlToOriginWithRefresh()
        })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleCopyInviteLinkClick}>
                    Copy invite link
                </button>
                <button onClick={handleLeaveRoomClick}>
                    Leave
                </button>
            </div>
            <span><b>Room's name:</b> {room.name}</span>
            <span><b>Your name:</b> {user.name}</span>
        </div>
    )
}