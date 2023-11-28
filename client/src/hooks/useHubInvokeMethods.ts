import { useContext } from "react"
import { HubConnectionContext } from "../contexts/HubConnectionContext"
import { HubInvokeMethodsEnum } from "../enums"
import { HubError } from "../types"
import { useError } from "./useError"

export function useHubInvokeMethods() {
  const { connection } = useContext(HubConnectionContext)
  
  const { addErrorHub } = useError()

  const invokeHubMethod = async<T = any> (hubInvokeMethod: HubInvokeMethodsEnum, ...args: any[]): Promise<T> => {
    return connection?.invoke(hubInvokeMethod, ...args).catch((e: HubError) => {
      addErrorHub(e)
    })
  }

  return {
    invokeHubMethod
  }
}