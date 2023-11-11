
interface CardProps {
    children?: string,
    onCardClick?: (value: string) => void,
    userName?: string,
    isSelected?: boolean
}

export default function Card({ onCardClick, userName, children, isSelected }: CardProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', width: 50, height: 100, backgroundColor: isSelected ? 'lightgray' : 'white' }}
                onClick={() => onCardClick && children && onCardClick(children)} >
                <p>{children}</p>
            </div>
            {userName && (
                <div style={{ display: "flex", justifyContent: 'center' }}>
                    <p>{userName}</p>
                </div>
            )}
        </div>
    )
}
