import { useContext } from 'react'
import { GameContext } from '../contexts/GameContext'
import { useHubInvokeMethods } from '../hooks/useHubInvokeMethods'
import { HubInvokeMethodsEnum } from '../enums'
import { getUrlWithRoomId, updateUrlToOriginWithRefresh } from '../helpers'
import { User } from '../types'

export default function GameInfo() {
    const { room, user, leaveRoom } = useContext(GameContext)

    const { invokeHubMethod } = useHubInvokeMethods()

    if (!room || !user) { return }

    const adminUserName = (room.users.find(x => x.isAdmin) as User).name

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

    const handleShowIssuesSideNavClick = (): void => {
        if (document.getElementById("issuesContainer") == null) { return }
        (document.getElementById("issuesContainer") as HTMLElement).classList.add('issues-container-side-navigation-show');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleCopyInviteLinkClick}>
                    Copy invite link
                </button>
                <button className='issues-container-side-navigation-buttons-display' onClick={handleShowIssuesSideNavClick}>
                    Show issues
                </button>
                <button onClick={handleLeaveRoomClick}>
                    Leave
                </button>
            </div>
            <span className='text-one-row-limit'><b>Room's name:</b> {room.name} (admin is {adminUserName})</span>
            <span className='text-one-row-limit'><b>Your name:</b> {user.name}</span>
        </div>
    )
}