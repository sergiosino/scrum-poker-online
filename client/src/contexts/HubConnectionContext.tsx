import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface HubConnectionContextProps {
    connection: HubConnection | null
}

export const HubConnectionContext = createContext<HubConnectionContextProps>({} as HubConnectionContextProps)

export function HubConnectionContextProvider({ children }: PropsWithChildren) {
    const [connection, setConnection] = useState<HubConnection | null>(null)

    useEffect(() => {
        const createConnection = async (): Promise<void> => {
            const apiUrl = import.meta.env.VITE_API_URL
            const connection = new HubConnectionBuilder()
                .withUrl(apiUrl)
                .configureLogging(LogLevel.Information)
                .build()
            
            connection.onclose(() => {
                alert('Disconnected from the server, refresh the page to continue')
            })

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
