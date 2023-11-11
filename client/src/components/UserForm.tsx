import { FormEvent } from 'react'

interface UserFormProps {
    userName: string | undefined,
    onFormSubmit: (name: string) => void
}

type FormProps = {
    userName: { value: string }
}

export default function UserForm({ userName, onFormSubmit }: UserFormProps) {

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps
        onFormSubmit(target.userName.value)
    }

    return (
        <>
            {!userName && (
                <form onSubmit={handleFormSubmit}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <label htmlFor="userName">Name</label>
                        <input type='text' name='userName' id='userName' />
                        <button type='submit'>Get in</button>
                    </div>
                </form>
            )}
            {userName && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                    {userName}
                </div>
            )}
        </>
    )
}