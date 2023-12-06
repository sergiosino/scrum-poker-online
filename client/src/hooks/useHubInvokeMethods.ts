import { useContext } from "react"
import { HubConnectionContext } from "../contexts/HubConnectionContext"
import { HubInvokeMethodsEnum } from "../enums"
import { HubError } from "../types"
import { useError } from "./useError"
import { CUSTOM_EXCEPTION_TEXT, UNCONTROLLED_ERROR } from "../constants"

export function useHubInvokeMethods() {
  const { connection } = useContext(HubConnectionContext)
  
  const { addErrorHub, addError } = useError()

  const invokeHubMethod = async<T = any> (hubInvokeMethod: HubInvokeMethodsEnum, ...args: any[]): Promise<T> => {
    return connection?.invoke(hubInvokeMethod, ...args).catch((e: HubError) => {
      if((e.message as string).includes(CUSTOM_EXCEPTION_TEXT)) { addErrorHub(e) }
      else { addError(UNCONTROLLED_ERROR) }      
    })
  }

  return {
    invokeHubMethod
  }
}