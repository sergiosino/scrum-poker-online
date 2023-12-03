import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { URL_API } from "../constants";

interface HubConnectionContextProps {
    connection: HubConnection | null
}

export const HubConnectionContext = createContext<HubConnectionContextProps>({} as HubConnectionContextProps)

export function HubConnectionContextProvider({ children }: PropsWithChildren) {
    const [connection, setConnection] = useState<HubConnection | null>(null)

    useEffect(() => {
        const createConnection = async (): Promise<void> => {
            const connection = new HubConnectionBuilder()
                .withUrl(URL_API)
                .configureLogging(LogLevel.Information)
                .build()

            await connection.start()
            
            setConnection(connection)
        }
        
        createConnection()
    }, [])

    return (
        <HubConnectionContext.Provider value={{ connection }}>
            {children}
        </HubConnectionContext.Provider>
    )

}
