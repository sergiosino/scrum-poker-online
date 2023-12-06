interface CardProps {
    children?: string,
    onCardClick?: (value: string) => void,
    onKickOutClick?: (value: string) => void,
    userName?: string,
    isSelected?: boolean,
    canBeKicked?: boolean,
}

export default function Card({
    onCardClick,
    onKickOutClick,
    userName,
    children,
    isSelected,
    canBeKicked
}: CardProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', border: '1px solid black', width: 50, height: 100, borderRadius: 6, backgroundColor: isSelected ? 'lightgray' : 'white' }}
                onClick={() => onCardClick && children && onCardClick(children)} >
                <span>{children}</span>
                {canBeKicked && (
                    <div style={{ position: 'absolute', right: 2, top: 2 }}>
                        <button onClick={() => onKickOutClick && userName && onKickOutClick(userName)}>x</button>
                    </div>
                )}
            </div>
            {userName && (
                <div className='text-100px-limit' style={{ display: "flex", justifyContent: 'center', marginTop: 5 }}>
                    <span>{userName}</span>
                </div>
            )}
        </div>
    )
}
