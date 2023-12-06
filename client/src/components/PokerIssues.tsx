import { useState, useContext, FormEvent } from 'react'
import { Issue } from '../types'
import { GameContext } from '../contexts/GameContext'
import { useHubInvokeMethods } from '../hooks/useHubInvokeMethods'
import { HubInvokeMethodsEnum } from '../enums'

interface IssueProps {
    issue: Issue,
    isAdmin: boolean,
    handleVote: (issueId: string) => void
}

function Issue({ issue, isAdmin, handleVote }: IssueProps) {

    const voteButtonClassName = isAdmin ? '' : 'visibility-hidden'

    const handleVoteClick = () => {
        handleVote(issue.id)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid black', borderRadius: 6, height: 100, padding: '20px 16px' }}>
            <span style={{ flex: 1 }} className="one-row-limit">{issue.name}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {issue.isVoting ? (
                    <button>
                        Voting
                    </button>
                ) : (
                    <button onClick={handleVoteClick} className={voteButtonClassName}>
                        Vote
                    </button>
                )}
                <span style={{ border: '1px solid black', borderRadius: 6, padding: '2px 6px' }}>{issue.average}</span>
            </div>
        </div>
    )
}

interface IssueEditableProps {
    handleSave: (issueName: string) => void,
    handleCancel: () => void
}

type FormProps = {
    issueName: { value: string }
}

function IssueEditable({ handleSave, handleCancel }: IssueEditableProps) {

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps

        handleSave(target.issueName.value)
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid black', borderRadius: 6, height: 120, padding: '20px 16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="issueName">Name:</label>
                    <input id='issueName' type='text' name='issueName' />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ padding: '4px 6px' }} onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type='submit'>
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}

export default function PokerIssues() {
    const [isAddingIssue, setIsAddingIssue] = useState(false)

    const { room, user } = useContext(GameContext)
    const { invokeHubMethod } = useHubInvokeMethods()

    if (!room || !user) { return }

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
                    {user.isAdmin && (
                        <button style={{ padding: '8px 12px' }} onClick={handleAddNewIssueClick}>
                            +
                        </button>
                    )}
                    <button
                        className='issues-container-side-navigation-buttons-display'
                        style={{ padding: '8px 12px' }}
                        onClick={handleCloseIssuesSideNavClick}>
                        x
                    </button>
                </div>
                {isAddingIssue && (
                    <div style={{ marginTop: 20 }}>
                        <IssueEditable handleSave={handleNewIssueSave} handleCancel={handleNewIssueCancel} />
                    </div>
                )}
            </div>
            <ul className={`issues-list ${listTopClassName}`}>
                {room.issues.map(issue => (
                    <li key={issue.id} style={{ margin: '10px 0px' }}>
                        <Issue issue={issue} isAdmin={user.isAdmin} handleVote={handleVoteIssueClick} />
                    </li>
                ))}
            </ul>
        </div>
    )
}