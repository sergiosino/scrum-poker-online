import { PropsWithChildren, createContext, useState, useContext, useEffect } from "react";
import { Issue } from "../types";
import { HubConnectionContext } from "./HubConnectionContext";
import { HubReceiveMethodsEnum } from "../enums";

interface IssueContextProps {
    issues: Issue[],
    issueVoting: Issue | null
}

export const IssuesContext = createContext<IssueContextProps>({} as IssueContextProps)

export function IssuesContextProvider({ children }: PropsWithChildren) {
    const { connection } = useContext(HubConnectionContext)

    const [issues, setIssues] = useState<Issue[]>([])

    const issueVoting = issues.find(x => x.isVoting) ?? null

    useEffect(() => {
        connection?.on(HubReceiveMethodsEnum.ReceiveIssuesUpdate, (newIssues: Issue[]) => {
            setIssues(newIssues)
        })
    }, [connection])

    return (
        <IssuesContext.Provider value={{ issues, issueVoting }}>
            {children}
        </IssuesContext.Provider>
    )

}
