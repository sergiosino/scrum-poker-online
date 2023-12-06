import { useContext } from 'react'
import { HubInvokeMethodsEnum, RoomStatesEnum } from "../enums"
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods"
import { GameContext } from '../contexts/GameContext'
import UsersCards from './UsersCards'
import { useError } from '../hooks/useError'
import { TEXT_SELECT_CARD, TEXT_SELECT_ISSUE_ADMIN, TEXT_SELECT_ISSUE_NO_ADMIN } from '../constants'

const DEFAULT_TABLE_CONTENT = <div style={{ height: 18 }} />

export default function CentralTable() {
    const { user, room, issueVoting } = useContext(GameContext)

    const { invokeHubMethod } = useHubInvokeMethods()
    const { error } = useError()

    if (!user || !room) { return }

    const numberUsersUp = Math.round(room.users.length / 2)
    const usersUp = room.users.slice(0, numberUsersUp)
    const usersDown = room.users.slice(numberUsersUp, room.users.length)

    // Calculate the average room value of the cards selected by the users
    const handleCalculatePokerResult = (): void => {
        invokeHubMethod(HubInvokeMethodsEnum.CalculateAverageRoomValue)
    }

    // The admin could reset all the users selected value
    const handleResetPokerValues = (): void => {
        invokeHubMethod(HubInvokeMethodsEnum.RestartRoomVote)
    }

    // Kicks a player from the room
    const handleKickOutUser = (userId: string): void => {
        invokeHubMethod(HubInvokeMethodsEnum.KickOutUserFromRoom, userId)
    }

    // Done in order to show always all the content of the table in the same place at the same place 
    let topTableContent = DEFAULT_TABLE_CONTENT
    let centralTableContent = DEFAULT_TABLE_CONTENT
    let bottomTableContent = DEFAULT_TABLE_CONTENT

    if (room.state === RoomStatesEnum.NoIssueSelected) {
        topTableContent = <span>{user.isAdmin ? TEXT_SELECT_ISSUE_ADMIN : TEXT_SELECT_ISSUE_NO_ADMIN}</span>
    }
    if (issueVoting) {
        topTableContent = <span className='text-one-row-limit'>Issue: {issueVoting.name}</span>
    }
    if (room.state === RoomStatesEnum.VotingIssue) {
        centralTableContent = <button onClick={handleCalculatePokerResult}>Calculate</button>
        bottomTableContent = user.cardValue ? bottomTableContent : (<span>{TEXT_SELECT_CARD}</span>)
    }
    if (issueVoting && room.state === RoomStatesEnum.WatchingFinalIssueAverage) {
        centralTableContent = <button onClick={handleResetPokerValues}>Complete</button>
        bottomTableContent = <span>The average is: <b>{issueVoting.average}</b></span>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <UsersCards
                users={usersUp}
                onKickOutClick={handleKickOutUser}
            />
            <div className='central-table'>
                {topTableContent}
                {centralTableContent}
                {bottomTableContent}
            </div>
            {error && <span><b>{error}</b></span>}
            <UsersCards
                users={usersDown}
                onKickOutClick={handleKickOutUser}
            />
        </div>
    )
}
