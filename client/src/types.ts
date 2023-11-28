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
    average: string,
    state: RoomStatesEnum,
    users: User[]
    issues: Issue[]
}

export type Issue = {
    name: string,
    description: string,
    average: string
    isVoting: boolean
}

export type HubError = {
    message: string
}