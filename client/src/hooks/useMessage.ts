import { useContext } from "react"
import { HubError } from "../types"
import { MessageContext } from "../contexts/MessageContext"
import { CUSTOM_EXCEPTION_TEXT } from "../constants"

export function useMessage() {
    const { message, setTimedMessage } = useContext(MessageContext)

    const addErrorHub = (newError: HubError): void => {
        const message = (newError?.message as string).split(CUSTOM_EXCEPTION_TEXT)[1]
        setTimedMessage(`⚠️ ${message} ⚠️`)
    }

    const addErrorMessage = (newError: string): void => {
        setTimedMessage(`⚠️ ${newError} ⚠️`)
    }

    const addMessage = (newMessage: string): void => {
        setTimedMessage(newMessage)
    }

    return {
        message,
        addErrorHub,
        addErrorMessage,
        addMessage
    }
}