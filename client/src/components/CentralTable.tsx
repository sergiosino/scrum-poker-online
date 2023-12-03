import { useContext } from 'react'
import { HubInvokeMethodsEnum, RoomStatesEnum } from "../enums"
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods"
import { GameContext } from '../contexts/GameContext'
import UsersCards from './UsersCards'

const TEXT_SELECT_CARD = 'Select a card!'

export default function CentralTable() {
    const { user, room } = useContext(GameContext)

    const { invokeHubMethod } = useHubInvokeMethods()

    if (!user || !room) { return }

    const numberUsersUp = Math.round(room.users.length / 2)
    const usersUp = room.users.slice(0, numberUsersUp)
    const usersDown = room.users.slice(numberUsersUp, room.users.length)
    const issueVoting = room.issues.find(issue => issue.isVoting)

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <UsersCards
                users={usersUp}
                onKickOutClick={handleKickOutUser}
            />
            <div className='central-table'>
                {issueVoting && (
                    <span className='issue-name-row-limit'>{issueVoting.name}</span>
                )}
                {(room.state === RoomStatesEnum.NoCardsSelected) && (
                    <span>{TEXT_SELECT_CARD}</span>
                )}
                {room.state === RoomStatesEnum.WithSomeSelectedCards && (
                    <>
                        <span>{TEXT_SELECT_CARD}</span>
                        <button onClick={handleCalculatePokerResult}>
                            Calculate
                        </button>
                    </>
                )}
                {room.state === RoomStatesEnum.WatchingFinalAverage && (
                    <>
                        <span>The average is: <b>{room.average}</b></span>
                        <button style={{ marginTop: 10 }} onClick={handleResetPokerValues}>
                            Reset
                        </button>
                    </>
                )}
            </div>
            <UsersCards
                users={usersDown}
                onKickOutClick={handleKickOutUser}
            />
        </div>
    )
}
