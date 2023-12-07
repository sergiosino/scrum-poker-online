import { useState, useContext } from 'react'
import { RoomContext } from '../../contexts/RoomContext'
import { useHubInvokeMethods } from '../../hooks/useHubInvokeMethods'
import { HubInvokeMethodsEnum } from '../../enums'
import { IssuesContext } from '../../contexts/IssuesContext'
import { UsersContext } from '../../contexts/UsersContext'
import IssueEditable from './IssueEditable'
import Issue from './Issue'

export default function PokerIssues() {
    const [isAddingIssue, setIsAddingIssue] = useState(false)

    const { room } = useContext(RoomContext)
    const { currentUser } = useContext(UsersContext)
    const { issues } = useContext(IssuesContext)

    const { invokeHubMethod } = useHubInvokeMethods()

    if (!room || !currentUser) { return <></> }

    const listTopClassName = isAddingIssue ? 'issues-list-top-adding-new-issue' : 'issues-list-top'

    const handleNewIssueSave = (issueName: string): void => {
        invokeHubMethod(HubInvokeMethodsEnum.CreateNewIssue, issueName).then(() => {
            setIsAddingIssue(false)
        })
    }

    const handleNewIssueCancel = (): void => {
        setIsAddingIssue(false)
    }

    const handleAddNewIssueClick = (): void => {
        setIsAddingIssue(true)
    }

    const handleVoteIssueClick = (issueId: string): void => {
        invokeHubMethod(HubInvokeMethodsEnum.SelectIssueToVote, issueId)
    }

    const handleCloseIssuesSideNavClick = (): void => {
        if (document.getElementById("issuesContainer") == null) { return }
        (document.getElementById("issuesContainer") as HTMLElement).classList.remove('issues-container-side-navigation-show');
    }

    return (
        <div id='issuesContainer' className='issues-container'>
            <div className='issues-header'>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>Issues</h2>
                    {currentUser.isAdmin && (
                        <button style={{ width: 100 }} onClick={handleAddNewIssueClick}>
                            Add new
                        </button>
                    )}
                    <button
                        className='issues-container-side-navigation-buttons-display'
                        style={{ width: 70 }}
                        onClick={handleCloseIssuesSideNavClick}>
                        Close
                    </button>
                </div>
                {isAddingIssue && (
                    <div style={{ marginTop: 20 }}>
                        <IssueEditable handleSave={handleNewIssueSave} handleCancel={handleNewIssueCancel} />
                    </div>
                )}
            </div>
            <ul className={`issues-list ${listTopClassName}`}>
                {issues.map(issue => (
                    <li key={issue.id} style={{ margin: '10px 0px' }}>
                        <Issue issue={issue} isAdmin={currentUser.isAdmin} handleVote={handleVoteIssueClick} />
                    </li>
                ))}
            </ul>
        </div>
    )
}