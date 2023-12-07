import { useContext } from 'react'
import { HubInvokeMethodsEnum, RoomStatesEnum } from "../enums"
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods"
import { RoomContext } from '../contexts/RoomContext'
import UsersCards from './cards/UsersCards'
import { TEXT_SELECT_CARD, TEXT_SELECT_ISSUE_ADMIN, TEXT_SELECT_ISSUE_NO_ADMIN } from '../constants'
import { IssuesContext } from '../contexts/IssuesContext'
import { UsersContext } from '../contexts/UsersContext'

const DEFAULT_TABLE_CONTENT = <div style={{ height: 18 }} />

export default function CentralTable() {
    const { room } = useContext(RoomContext)
    const { users, currentUser } = useContext(UsersContext)
    const { issueVoting } = useContext(IssuesContext)

    const { invokeHubMethod } = useHubInvokeMethods()

    if (!currentUser || !room) { return <></> }

    const numberUsersUp = Math.round(users.length / 2)
    const usersUp = users.slice(0, numberUsersUp)
    const usersDown = users.slice(numberUsersUp, users.length)

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
        topTableContent = <span>{currentUser.isAdmin ? TEXT_SELECT_ISSUE_ADMIN : TEXT_SELECT_ISSUE_NO_ADMIN}</span>
    }
    if (issueVoting) {
        topTableContent = <span className='text-one-row-limit'>Issue: <b>{issueVoting.name}</b></span>
    }
    if (room.state === RoomStatesEnum.VotingIssue) {
        centralTableContent = <button style={{ maxWidth: 100 }} onClick={handleCalculatePokerResult}>Calculate</button>
        bottomTableContent = currentUser.cardValue ? bottomTableContent : (<span>{TEXT_SELECT_CARD}</span>)
    }
    if (issueVoting && room.state === RoomStatesEnum.WatchingFinalIssueAverage) {
        centralTableContent = <button style={{ maxWidth: 100 }} onClick={handleResetPokerValues}>Complete</button>
        bottomTableContent = <span>The average is: <b>{issueVoting.average}</b></span>
    }

    return (
        <>
            <div style={{ height: 110 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <UsersCards
                    users={usersUp}
                    onKickOutClick={handleKickOutUser}
                />
                <div className='central-table'>
                    {topTableContent}
                    {centralTableContent}
                    {bottomTableContent}
                </div>
                <UsersCards
                    users={usersDown}
                    onKickOutClick={handleKickOutUser}
                />
            </div>
            <div style={{ height: 125 }} />
        </>
    )
}
