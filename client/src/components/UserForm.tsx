import { FormEvent } from 'react'

interface UserFormProps {
    userName: string | undefined,
    onFormSubmit: (game: string, userName: string) => void
}

type FormProps = {
    gameName: { value: string }
    userName: { value: string }
}

export default function UserForm({ userName, onFormSubmit }: UserFormProps) {

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps
        onFormSubmit(target.gameName.value, target.userName.value)
    }

    return (
        <>
            {!userName ? (
                <form onSubmit={handleFormSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="gameName">Game:</label>
                            <input id='gameName' type='text' name='userName' />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="userName">User:</label>
                            <input id='userName' type='text' name='userName' />
                        </div>
                        <button type='submit'>Get in</button>
                    </div>
                </form>
            ) : { userName }}
        </>
    )
}