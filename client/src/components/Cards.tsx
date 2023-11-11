import Card from "./Card"

interface CardsProps {
    onCardClick: (value: string) => void
}

export default function Cards({ onCardClick }: CardsProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
            <Card onCardClick={onCardClick}>{'0'}</Card>
            <Card onCardClick={onCardClick}>{'1'}</Card>
            <Card onCardClick={onCardClick}>{'2'}</Card>
            <Card onCardClick={onCardClick}>{'3'}</Card>
            <Card onCardClick={onCardClick}>{'5'}</Card>
            <Card onCardClick={onCardClick}>{'8'}</Card>
            <Card onCardClick={onCardClick}>{'13'}</Card>
            <Card onCardClick={onCardClick}>{'21'}</Card>
            <Card onCardClick={onCardClick}>{'34'}</Card>
            <Card onCardClick={onCardClick}>{'55'}</Card>
            <Card onCardClick={onCardClick}>{'89'}</Card>
            <Card onCardClick={onCardClick}>{'?'}</Card>
            <Card onCardClick={onCardClick}>{'☕'}</Card>
        </div>
    )
}
