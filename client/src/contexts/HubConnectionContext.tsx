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
            const connection = new HubConnectionBuilder()
                .withUrl("https://scrum-poker-online-api.fly.dev/scrum-poker-online")
                // .withUrl("https://localhost:7073/scrum-poker-online")
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
