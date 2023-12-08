import { useContext } from 'react'
import { RoomContext } from '../contexts/RoomContext'
import { getUrlWithRoomId } from '../helpers'
import { useMessage } from '../hooks/useMessage'
import { URL_PARAM_ROOM } from '../constants'

export default function GameInfo() {
    const { room, leaveRoom } = useContext(RoomContext)

    const { message, addMessage } = useMessage()

    if (!room) { return <></> }

    const handleCopyInviteLinkClick = (): void => {
        const inviteUrl = getUrlWithRoomId(URL_PARAM_ROOM, room.id)
        navigator.clipboard.writeText(inviteUrl.href)
        addMessage('🥳 Invitation link copied to clipboard! 🥳')
    }

    const handleLeaveRoomClick = (): void => {
        leaveRoom()
    }

    const handleShowIssuesSideNavClick = (): void => {
        if (document.getElementById("issuesContainer") == null) { return }
        (document.getElementById("issuesContainer") as HTMLElement).classList.add('issues-container-side-navigation-show');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%', maxWidth: 400 }}>
            <span className='text-one-row-limit'><b>Room's name:</b> {room.name}</span>
            <div style={{ display: 'flex', gap: 16, width: '100%' }}>
                <button onClick={handleCopyInviteLinkClick}>
                    Get invite link
                </button>
                <button className='issues-container-side-navigation-buttons-display' onClick={handleShowIssuesSideNavClick}>
                    Show issues
                </button>
                <button onClick={handleLeaveRoomClick}>
                    Leave
                </button>
            </div>
            {message && <span><b>{message}</b></span>}
        </div>
    )
}