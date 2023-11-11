import Card from "./Card"

interface CardsProps {
    onCardClick: (value: string) => void
}

const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']

export default function Cards({ onCardClick }: CardsProps) {
    return (
        <ul style={{ whiteSpace: 'nowrap', padding: 0 }}>
            {CARD_VALUES.map(cardValue => (
                <li style={{ display: 'inline-block', margin: '0px 5px' }}>
                    <Card key={cardValue} onCardClick={onCardClick}>{cardValue}</Card>
                </li>
            ))}
        </ul>
    )
}
