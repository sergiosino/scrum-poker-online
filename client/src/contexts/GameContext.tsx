import { PropsWithChildren, createContext, useRef, useState, MutableRefObject } from "react";
import { Issue, Room, User } from "../types";
import { STORAGE_USER_ID } from "../constants";

interface GameContextProps {
    room: Room | null,
    setRoom: (room: Room | null) => void,
    user: User | null,
    userId: MutableRefObject<string | null>,
    setUserId: (newUserId: string) => void,
    issueVoting: Issue | null,
    leaveRoom: () => void,
}

export const GameContext = createContext<GameContextProps>({} as GameContextProps)

export function GameContextProvider({ children }: PropsWithChildren) {
    const [room, setRoom] = useState<Room | null>(null)

    const userId = useRef<string | null>(sessionStorage.getItem(STORAGE_USER_ID))
    const user = userId.current
        ? room?.users.find(x => x?.id === userId.current) as User
        : null
    const issueVoting = room?.issues.find(x => x.isVoting) ?? null

    const setUserId = (newUserId: string): void => {
        userId.current = newUserId
        sessionStorage.setItem(STORAGE_USER_ID, newUserId)
    }

    const leaveRoom = (): void => {
        sessionStorage.removeItem(STORAGE_USER_ID)
        setRoom(null)
    }

    return (
        <GameContext.Provider value={{
            room,
            setRoom,
            user,
            userId,
            setUserId,
            issueVoting,
            leaveRoom
        }}>
            {children}
        </GameContext.Provider>
    )

}
