import { useContext } from 'react'
import { HubInvokeMethodsEnum } from "../enums"
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods"
import Card from "./Card"
import { GameContext } from '../contexts/GameContext'
import { CARD_VALUES } from '../constants'

export default function PokerCards() {
    const { user } = useContext(GameContext)
    const { invokeHubMethod } = useHubInvokeMethods()

    // Share the user selected value card
    const handleCardClick = (value: string): void => {
        if (value != user?.cardValue) {
            invokeHubMethod(HubInvokeMethodsEnum.SelectCardValue, value)
        }
    }

    return (
        <ul style={{ whiteSpace: 'nowrap', listStyleType: 'none', padding: 0 }}>
            {CARD_VALUES.map(cardValue => (
                <li key={cardValue} style={{ display: 'inline-block', margin: '0px 5px' }}>
                    <Card
                        onCardClick={handleCardClick}
                        isSelected={user?.cardValue === cardValue}
                    >
                        {cardValue}
                    </Card>
                </li>
            ))}
        </ul>
    )
}
