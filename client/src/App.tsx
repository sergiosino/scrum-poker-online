import './app.css'
import { useState } from 'react'
import CentralTable from './components/CentralTable'
import Cards from './components/Cards'
import UserForm from './components/UserForm'
import { HubError, PokerResult, User, UsersInfo } from './types'
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'
import { useHubError } from './hooks/useHubError'

function App() {
  // SignalR Hub connection
  const [connection, setConnection] = useState<HubConnection>()
  // All the users info in the room
  const [usersInfo, setUsersInfo] = useState<UsersInfo>([])
  // Current user info
  const [user, setUser] = useState<User>(null)
  // Saves the poker result, the average of all users selection
  const [pokerResult, setPokerResult] = useState<PokerResult>(null)

  const { error, addError } = useHubError()

  const handleFormSubmit = async (room: string, userName: string): Promise<void> => {
    try {
      // Create connection
      const connection = new HubConnectionBuilder()
        .withUrl("https://scrum-poker-online-api.fly.dev/scrum-poker-online")
        // .withUrl("https://localhost:7073/scrum-poker-online")
        .configureLogging(LogLevel.Information)
        .build()

      // Receive the updated users
      connection.on('ReceiveUpdatedUsers', (newUsersInfo: UsersInfo) => {
        setUsersInfo(newUsersInfo)
      })

      // Receive the new card values
      connection.on('ReceiveCardValue', (name: string, value: string) => {
        setUsersInfo(usersInfo => usersInfo.map(userInfo => userInfo?.name === name ? { ...userInfo, value } : userInfo))
      })

      // Receive the average value from all the users cards
      connection.on('ReceiveAverageRoomValue', (average: PokerResult) => {
        setPokerResult(average)
      })

      // Start connection
      await connection.start()

      // Call the join scrum poker room for this user
      await connection.invoke("JoinScrumPoker", { room, name: userName }).then((newUser: User) => {
        setUser(newUser)
      }).catch((e: HubError) => {
        addError(e)
      })

      setConnection(connection)
    } catch (e) {
      console.log(e)
    }
  }

  // Share the user selected value card
  const handleCardClick = async (value: string): Promise<void> => {
    try {
      if (connection && value != user?.value) {
        await connection.invoke("SelectCardValue", value)
        setUser({ ...user, value } as User)
      }
    } catch (e) {
      console.log(e)
    }
  }

  // Ask to calculate the average room value of the cards selected by the users
  const handleCalculatePokerResult = async (): Promise<void> => {
    try {
      if (connection) {
        await connection.invoke("CalculateAverageRoomValue")
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleResetPokerValues = async (): Promise<void> => {
    try {
      if (connection) {
        await connection.invoke("ResetRoomValues")
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div style={{}}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'fixed', left: 0, right: 0, top: 0, marginTop: 25 }}>
        <UserForm user={user} onFormSubmit={handleFormSubmit} />
        {error && <p>{error}</p>}
      </div>
      {user && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CentralTable
              usersInfo={usersInfo}
              pokerResult={pokerResult}
              onCalculatePokerResult={handleCalculatePokerResult}
              onResetPokerValues={handleResetPokerValues}
              isAdmin={user.isAdmin}
            />
          </div>
          <div className='cards-container'>
            <Cards cardSelected={user.value as string} onCardClick={handleCardClick} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
