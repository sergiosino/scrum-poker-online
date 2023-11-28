import { useContext } from 'react'
import { HubInvokeMethodsEnum, RoomStatesEnum } from "../enums"
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods"
import { GameContext } from '../contexts/GameContext'
import UsersCards from './UsersCards'

export default function CentralTable() {
    const { user, room } = useContext(GameContext)

    const { invokeHubMethod } = useHubInvokeMethods()

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <UsersCards
                users={usersUp}
                onKickOutClick={handleKickOutUser}
            />
            <div className='central-table'>
                {(room.state === RoomStatesEnum.NoCardsSelected || room.state === RoomStatesEnum.WithSomeSelectedCards) && (
                    <p>Select a card!</p>
                )}
                {room.state === RoomStatesEnum.WatchingFinalAverage && (
                    <p>The average is: <b>{room.average}</b></p>
                )}
                {room.state === RoomStatesEnum.WithSomeSelectedCards && (
                    <button onClick={handleCalculatePokerResult}>
                        Calculate
                    </button>
                )}
                {room.state === RoomStatesEnum.WatchingFinalAverage && (
                    <button onClick={handleResetPokerValues}>
                        Reset
                    </button>
                )}
            </div>
            <UsersCards
                users={usersDown}
                onKickOutClick={handleKickOutUser}
            />
        </div>
    )
}
