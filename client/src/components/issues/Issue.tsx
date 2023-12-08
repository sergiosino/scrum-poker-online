import { Issue } from "../../types"

interface IssueProps {
    issue: Issue,
    isAdmin: boolean,
    handleVote: (issueId: string) => void
}

export default function Issue({ issue, isAdmin, handleVote }: IssueProps) {
    const voteButtonClassName = isAdmin ? '' : 'visibility-hidden'

    const handleVoteClick = () => {
        handleVote(issue.id)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', borderRadius: 6, padding: '24px 16px', gap: 16 }}>
            <span>{issue.name}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: 80 }}>
                    {issue.isVoting ? (
                        <button >
                            Voting
                        </button>
                    ) : (
                        <button onClick={handleVoteClick} className={voteButtonClassName}>
                            Vote
                        </button>
                    )}
                </div>
                <span style={{ border: '1px solid black', borderRadius: 6, padding: '2px 6px' }}>{issue.average}</span>
            </div>
        </div>
    )
}
