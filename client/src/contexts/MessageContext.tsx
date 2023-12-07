import { PropsWithChildren, createContext, useRef, useState } from "react";

interface GameContextProps {
    message: string | null,
    setTimedMessage: (message: string) => void,
}

export const MessageContext = createContext<GameContextProps>({} as GameContextProps)

export function MessageContextProvider({ children }: PropsWithChildren) {
    const [message, setMessage] = useState<string | null>(null)

    const messageTimeout = useRef<NodeJS.Timeout | null>(null)

    const setTimedMessage = (newMessage: string): void => {
        setMessage(newMessage)

        if (messageTimeout.current) {
            clearTimeout(messageTimeout.current)
        }

        messageTimeout.current = setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    return (
        <MessageContext.Provider value={{
            message,
            setTimedMessage
        }}>
            {children}
        </MessageContext.Provider>
    )
}
