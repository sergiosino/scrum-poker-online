import { PropsWithChildren, createContext, useRef, useState, useEffect, useContext } from "react";
import { Room, User } from "../types";
import { STORAGE_USER_ID } from "../constants";
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods";
import { HubInvokeMethodsEnum } from "../enums";
import { HubConnectionContext } from "./HubConnectionContext";

interface GameContextProps {
    room: Room | null,
    setRoom: (room: Room | null) => void,
    user: User | null,
    setUserId: (newUserId: string) => void,
    leaveRoom: () => void,
}

export const GameContext = createContext<GameContextProps>({} as GameContextProps)

export function GameContextProvider({ children }: PropsWithChildren) {
    const { connection } = useContext(HubConnectionContext)

    const [room, setRoom] = useState<Room | null>(null)

    const { invokeHubMethod } = useHubInvokeMethods()

    const userId = useRef<string | null>(sessionStorage.getItem(STORAGE_USER_ID))
    const user = userId.current
        ? room?.users.find(x => x?.id === userId.current) as User
        : null

    const setUserId = (newUserId: string): void => {
        userId.current = newUserId
        sessionStorage.setItem(STORAGE_USER_ID, newUserId)
    }

    const leaveRoom = (): void => {
        sessionStorage.removeItem(STORAGE_USER_ID)
        setRoom(null)
    }

    useEffect(() => {
        if (connection && userId.current && !room) {
            console.log(userId.current)
            invokeHubMethod(HubInvokeMethodsEnum.RetrieveUserRoom, userId.current).then((retrievedRoom: Room) => {
                setRoom(retrievedRoom)
            }).catch(() => {
                sessionStorage.removeItem(STORAGE_USER_ID)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection])

    return (
        <GameContext.Provider value={{
            room,
            setRoom,
            user,
            setUserId,
            leaveRoom
        }}>
            {children}
        </GameContext.Provider>
    )

}
