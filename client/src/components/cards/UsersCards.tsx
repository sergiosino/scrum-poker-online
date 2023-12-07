import { useContext } from 'react'
import { RoomContext } from "../../contexts/RoomContext"
import { User, UsersInfo } from "../../types"
import Card from "./Card"
import { RoomStatesEnum } from '../../enums'
import { CARD_VALUE_NOT_VISIBLE } from '../../constants'
import { UsersContext } from '../../contexts/UsersContext'

interface UsersCardsProps {
    users: UsersInfo,
    onKickOutClick?: (userId: string) => void,
}

export default function UsersCards({ users, onKickOutClick }: UsersCardsProps) {
    const { room } = useContext(RoomContext)
    const { currentUser } = useContext(UsersContext)

    if (!currentUser || !room) { return <></> }

    const calculateUserCardValue = (roomUser: User): string => {
        if (!roomUser.cardValue) { return '' }
        if (room.state === RoomStatesEnum.WatchingFinalIssueAverage) { return roomUser.cardValue }
        return CARD_VALUE_NOT_VISIBLE
    }

    const canBeKicked = (roomUserId: string): boolean => {
        if (currentUser.isAdmin && roomUserId !== currentUser.id) { return true }
        return false
    }

    return (
        <ul style={{ whiteSpace: 'nowrap', listStyleType: 'none', padding: 0, margin: 0 }}>
            {users.map(roomUser => (
                <li key={roomUser.id} style={{ display: 'inline-block', margin: '0px 10px' }}>
                    <Card
                        userName={roomUser.name}
                        canBeKicked={canBeKicked(roomUser.id)}
                        onKickOutClick={() => onKickOutClick && onKickOutClick(roomUser.id)}
                    >
                        {calculateUserCardValue(roomUser)}
                    </Card>
                </li>
            ))}
        </ul>
    )
}
