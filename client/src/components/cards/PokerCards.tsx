import { useContext } from 'react'
import { HubInvokeMethodsEnum } from "../../enums"
import { useHubInvokeMethods } from "../../hooks/useHubInvokeMethods"
import Card from "./Card"
import { CARD_VALUES } from '../../constants'
import { UsersContext } from '../../contexts/UsersContext'

export default function PokerCards() {
    const { currentUser } = useContext(UsersContext)

    const { invokeHubMethod } = useHubInvokeMethods()

    if (!currentUser) { return <></> }

    // Share the user selected value card
    const handleCardClick = (value: string): void => {
        if (value != currentUser.cardValue) {
            invokeHubMethod(HubInvokeMethodsEnum.SelectCardValue, value)
        }
    }

    return (
        <ul style={{ display:'flex', whiteSpace: 'nowrap', listStyleType: 'none', padding: 0, margin: 0, gap: 8 }}>
            {CARD_VALUES.map(cardValue => (
                <li key={cardValue} style={{ display: 'inline-block' }}>
                    <Card
                        onCardClick={handleCardClick}
                        isSelected={currentUser.cardValue === cardValue}
                    >
                        {cardValue}
                    </Card>
                </li>
            ))}
        </ul>
    )
}
