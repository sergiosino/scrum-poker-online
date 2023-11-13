import { FormEvent } from 'react'
import { User } from '../types'

interface UserFormProps {
    user: User,
    onFormSubmit: (room: string, userName: string) => void
}

type FormProps = {
    roomName: { value: string }
    userName: { value: string }
}

export default function UserForm({ user, onFormSubmit }: UserFormProps) {

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const target = event.target as EventTarget & FormProps
        onFormSubmit(target.roomName.value, target.userName.value)
    }

    return (
        <>
            {!user ? (
                <div style={{ margin: '50px 0px' }}>
                    <form onSubmit={handleFormSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="roomName">Room:</label>
                                <input id='roomName' type='text' name='roomName' />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="userName">User:</label>
                                <input id='userName' type='text' name='userName' />
                            </div>
                            <button type='submit'>Get in</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p>Room's name: {user.room}</p>
                    <p>Your name: {user.name}</p>
                </div>
            )}
        </>
    )
}