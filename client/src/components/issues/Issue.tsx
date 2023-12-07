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
        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', borderRadius: 6, height: 100, padding: '20px 16px' }}>
            <span style={{ flex: 1 }} className="text-one-row-limit">{issue.name}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', width: 80 }}>
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
