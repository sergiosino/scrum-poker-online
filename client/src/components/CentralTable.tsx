import { PokerResult, UsersInfo } from "../types"
import Card from "./Card"

interface UsersCardsProps {
    usersInfo: UsersInfo,
    pokerResult: PokerResult,
    onDeleteClick?: (value: string) => void,
    isAdmin?: boolean,
}

function UsersCards({ usersInfo, pokerResult, onDeleteClick, isAdmin }: UsersCardsProps) {
    return (
        <div style={{ display: 'flex', gap: 20 }}>
            {usersInfo && usersInfo.map(userInfo => (
                <Card
                    key={userInfo?.name}
                    userName={userInfo?.name}
                    isAdmin={isAdmin}
                    onDeleteClick={onDeleteClick}
                >
                    {pokerResult !== null || userInfo?.value === null ? (userInfo?.value as string) : '**'}
                </Card>
            ))}
        </div>
    )
}

interface TableProps {
    usersInfo: UsersInfo,
    pokerResult: PokerResult,
    onCalculatePokerResult: () => void,
    onResetPokerValues: () => void,
    onDeleteClick?: (value: string) => void,
    isAdmin?: boolean,
}

export default function CentralTable({
    usersInfo,
    pokerResult,
    onCalculatePokerResult,
    onResetPokerValues,
    onDeleteClick,
    isAdmin
}: TableProps) {

    const numberUsersUp = Math.round(usersInfo.length / 2)
    const usersInfoUp = usersInfo.slice(0, numberUsersUp)
    const usersInfoDown = usersInfo.slice(numberUsersUp, usersInfo.length)

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <UsersCards
                usersInfo={usersInfoUp}
                pokerResult={pokerResult}
                onDeleteClick={onDeleteClick}
                isAdmin={isAdmin}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid black', width: 300, height: 200, borderRadius: 24 }}>
                <p>{pokerResult !== null ? <>The average is: <b>{pokerResult}</b></> : 'Select a card!'}</p>
                {isAdmin && (
                    <>
                        {pokerResult !== null ? (
                            <button onClick={onResetPokerValues}>
                                Reset
                            </button>
                        ) : (
                            <button onClick={onCalculatePokerResult}>
                                Calculate
                            </button>
                        )}
                    </>
                )}
            </div>
            <UsersCards
                usersInfo={usersInfoDown}
                pokerResult={pokerResult}
                onDeleteClick={onDeleteClick}
                isAdmin={isAdmin}
            />
        </div>
    )
}
