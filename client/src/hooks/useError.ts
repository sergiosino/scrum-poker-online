import { useContext } from "react"
import { HubError } from "../types"
import { ErrorContext } from "../contexts/ErrorContext"
import { CUSTOM_EXCEPTION_TEXT } from "../constants"

// Returns the error returned by the Hub
export function useError() {
    // Text error
    const { error, errorTimeout, setError } = useContext(ErrorContext)

    const addErrorHub = (newError: HubError): void => {
        const message = (newError?.message as string).split(CUSTOM_EXCEPTION_TEXT)[1]
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