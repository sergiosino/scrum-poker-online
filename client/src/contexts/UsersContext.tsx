import { PropsWithChildren, createContext, useRef, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { STORAGE_USER_ID } from "../constants";
import { HubReceiveMethodsEnum } from "../enums";
import { HubConnectionContext } from "./HubConnectionContext";

interface UsersContextProps {
    users: User[],
    currentUser: User | null
}

export const UsersContext = createContext<UsersContextProps>({} as UsersContextProps)

export function UsersContextProvider({ children }: PropsWithChildren) {
    const { connection } = useContext(HubConnectionContext)

    const [users, setUsers] = useState<User[]>([])

    const userId = useRef<string | null>(sessionStorage.getItem(STORAGE_USER_ID))

    const currentUser = userId.current
        ? users.find(x => x.id === userId.current) ?? null
        : null

    useEffect(() => {
        connection?.on(HubReceiveMethodsEnum.ReceiveUsersUpdate, (newUsers: User[]) => {
            setUsers(newUsers)
        })
        connection?.on(HubReceiveMethodsEnum.ReceiveMyUserId, (newUserId: string) => {
            userId.current = newUserId
            sessionStorage.setItem(STORAGE_USER_ID, newUserId)
        })
    }, [connection])
    
    return (
        <UsersContext.Provider value={{ users, currentUser }}>
            {children}
        </UsersContext.Provider>
    )

}
