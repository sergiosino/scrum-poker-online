import { useContext } from 'react'
import { GameContext } from "../contexts/GameContext"
import { User, UsersInfo } from "../types"
import Card from "./Card"
import { RoomStatesEnum } from '../enums'
import { CARD_VALUE_NOT_VISIBLE } from '../constants'

interface UsersCardsProps {
    users: UsersInfo,
    onKickOutClick?: (userId: string) => void,
}

export default function UsersCards({ users, onKickOutClick }: UsersCardsProps) {
    const { user, room } = useContext(GameContext)

    if (!user || !room) { return }

    const calculateUserCardValue = (roomUser: User): string => {
        if (!roomUser.cardValue) { return '' }
        if (room.state === RoomStatesEnum.WatchingFinalIssueAverage) { return roomUser.cardValue }
        return CARD_VALUE_NOT_VISIBLE
    }

    return (
        <ul style={{ whiteSpace: 'nowrap', listStyleType: 'none', padding: 0, margin: 0 }}>
            {users.map(roomUser => (
                <li key={roomUser.id} style={{ display: 'inline-block', margin: '0px 10px' }}>
                    <Card
                        userName={roomUser.name}
                        isAdmin={user.isAdmin}
                        onKickOutClick={() => onKickOutClick && onKickOutClick(roomUser.id)}
                    >
                        {calculateUserCardValue(roomUser)}
                    </Card>
                </li>
            ))}
        </ul>
    )
}
