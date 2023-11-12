import { PokerResult, UsersInfo } from "../types"
import Card from "./Card"

interface TableProps {
    usersInfo: UsersInfo,
    pokerResult: PokerResult,
    onCalculatePokerResult: () => void,
    onResetPokerValues: () => void,
    isAdmin?: boolean,
}

export default function CentralTable({ 
    usersInfo, 
    pokerResult, 
    onCalculatePokerResult, 
    onResetPokerValues, 
    isAdmin 
}: TableProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid black', width: 300, height: 200 }}>
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
            <div style={{ display: 'flex', gap: 30 }}>
                {usersInfo && usersInfo.map(userInfo => (
                    <Card key={userInfo?.name} userName={userInfo?.name}>
                        {pokerResult !== null || userInfo?.value === null ? (userInfo?.value as string) : '**'}
                    </Card>
                ))}
            </div>
        </div>
    )
}
