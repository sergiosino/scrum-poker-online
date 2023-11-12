import { useRef, useState } from "react"
import { HubError } from "../types"

// Returns the error returned by the Hub
export function useError() {
    // Text error
    const [error, setError] = useState<string | null>(null)
    const errorTimeout = useRef<number | null>(null)

    const addErrorHub = (newError: HubError): void => {
        const message = (newError?.message as string).split('HubException: ')[1]
        setError(message)

        if (errorTimeout.current) {
            clearTimeout(errorTimeout.current)
        }

        errorTimeout.current = setTimeout(() => {
            setError(null)
        }, 5000)
    }

    const addError = (message: string): void => {
        setError(message)

        if (errorTimeout.current) {
            clearTimeout(errorTimeout.current)
        }

        errorTimeout.current = setTimeout(() => {
            setError(null)
        }, 5000)
    }

    return {
        error,
        addErrorHub,
        addError
    }
}