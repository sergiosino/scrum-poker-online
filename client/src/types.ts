
export type UsersInfo = User[]

export type User = {
    name: string,
    room: string,
    value?: string | null,
    isAdmin: boolean
} | null

export type HubError = {
    message: string
}  | null

export type PokerResult = number | null