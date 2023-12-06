import { RoomStatesEnum } from "./enums"

export type UsersInfo = User[]

export type User = {
    id: string,
    name: string,
    room: string, // remove
    cardValue?: string | null,
    isAdmin: boolean
}

export type Room = {
    id: string,
    name: string,
    state: RoomStatesEnum,
    users: User[]
    issues: Issue[]
}

export type Issue = {
    id: string,
    name: string,
    average: string
    isVoting: boolean
}

export type HubError = {
    message: string
}