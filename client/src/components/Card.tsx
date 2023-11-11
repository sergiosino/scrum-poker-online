
interface CardProps {
    children?: string,
    onCardClick?: (value: string) => void,
    userName?: string
}

export default function Card({ onCardClick, userName, children }: CardProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', width: 50, height: 100 }}
                onClick={() => onCardClick && children && onCardClick(children)} >
                <p>{children}</p>
            </div>
            {userName && <p>{userName}</p>}
        </div>
    )
}
