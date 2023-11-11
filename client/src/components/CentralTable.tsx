import { UsersInfo } from "../types"
import Card from "./Card"

interface TableProps {
    usersInfo: UsersInfo
}

export default function CentralTable({ usersInfo }: TableProps) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', width: 300, height: 200 }}>
                MEDIA
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
                {usersInfo && usersInfo.map(userInfo => (
                    <Card key={userInfo?.name} userName={userInfo?.name}>{userInfo?.value}</Card>
                ))}
            </div>
        </div>
    )
}
