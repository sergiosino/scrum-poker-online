import { PropsWithChildren, createContext, useState, useEffect, useContext } from "react";
import { Room } from "../types";
import { STORAGE_USER_ID } from "../constants";
import { HubConnectionContext } from "./HubConnectionContext";
import { HubInvokeMethodsEnum, HubReceiveMethodsEnum } from "../enums";
import { useHubInvokeMethods } from "../hooks/useHubInvokeMethods";

interface GameContextProps {
    room: Room | null,
    leaveRoom: () => void
}

export const RoomContext = createContext<GameContextProps>({} as GameContextProps)

export function RoomContextProvider({ children }: PropsWithChildren) {
    const { connection } = useContext(HubConnectionContext)

    const [room, setRoom] = useState<Room | null>(null)

    const { invokeHubMethod } = useHubInvokeMethods()

    const removeGameInfo = () => {
        sessionStorage.removeItem(STORAGE_USER_ID)
        setRoom(null)
    }

    const leaveRoom = (): void => {
        invokeHubMethod(HubInvokeMethodsEnum.LeaveRoom).finally(() => {
            removeGameInfo()
        })
    }

    useEffect(() => {
        connection?.on(HubReceiveMethodsEnum.ReceiveRoomUpdate, (room: Room) => {
            setRoom(room)
        })
        connection?.on(HubReceiveMethodsEnum.ReceiveKickOut, () => {
            removeGameInfo()
        })

        // After a page refresh room info is lost so,
        // if userId exists and does not have room, try to retrieve room info
        const storageUserId = sessionStorage.getItem(STORAGE_USER_ID)
        if (connection && storageUserId && !room) {
            invokeHubMethod(HubInvokeMethodsEnum.RetrieveUserRoom, storageUserId).catch(() => {
                removeGameInfo()
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection])

    return (
        <RoomContext.Provider value={{ room, leaveRoom}}>
            {children}
        </RoomContext.Provider>
    )

}
