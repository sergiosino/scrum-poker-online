import { PropsWithChildren, createContext, useRef, useState, MutableRefObject } from "react";

interface GameContextProps {
    error: string | null,
    setError: (error: string | null) => void,
    errorTimeout: MutableRefObject<number | null>,
}

export const ErrorContext = createContext<GameContextProps>({} as GameContextProps)

export function ErrorContextProvider({ children }: PropsWithChildren) {
    const [error, setError] = useState<string | null>(null)

    const errorTimeout = useRef<number | null>(null)

    return (
        <ErrorContext.Provider value={{
            error,
            setError,
            errorTimeout,
        }}>
            {children}
        </ErrorContext.Provider>
    )

}
