import { useContext } from "react"
import { HubConnectionContext } from "../contexts/HubConnectionContext"
import { Room } from "../types"
import { GameContext } from "../contexts/GameContext"
import { HubReceiveMethodsEnum } from "../enums"
import { updateUrlToOriginWithRefresh } from "../helpers"

export function useHubReceiveMethods() {
    const { connection } = useContext(HubConnectionContext)
    const { setUserId, setRoom, leaveRoom } = useContext(GameContext)

    const createAllReceiveMethods = (): void => {
        connection?.on(HubReceiveMethodsEnum.ReceiveRoomUpdate, (room: Room) => {
            setRoom(room)
        })

        connection?.on(HubReceiveMethodsEnum.ReceiveMyUserId, (userId: string) => {
            setUserId(userId)
        })
        
        connection?.on(HubReceiveMethodsEnum.ReceiveKickOut, () => {
            leaveRoom()
            updateUrlToOriginWithRefresh()
        })
    }

    return {
        createAllReceiveMethods
    }
}