import { FormEvent } from 'react'

interface IssueEditableProps {
    handleSave: (issueName: string) => void,
    handleCancel: () => void
}

type FormProps = {
    issueName: { value: string }
}

export default function IssueEditable({ handleSave, handleCancel }: IssueEditableProps) {
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps

        handleSave(target.issueName.value)
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid black', borderRadius: 6, height: 120, padding: '20px 16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="issueName">Name:</label>
                    <input id='issueName' type='text' name='issueName' />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleCancel}>
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
