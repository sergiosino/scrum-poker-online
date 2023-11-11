import './app.css'
import { useState } from 'react'
import CentralTable from './components/CentralTable'
import Cards from './components/Cards'
import UserForm from './components/UserForm'
import { User, UsersInfo } from './types'
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr'

function App() {
  // SignalR Hub connection
  const [connection, setConnection] = useState<HubConnection>()
  // All the users info in the game
  const [usersInfo, setUsersInfo] = useState<UsersInfo>([])
  // Current user info
  const [user, setUser] = useState<User>(null)

  const handleFormSubmit = async (game: string, userName: string): Promise<void> => {
    try {
      // Create connection
      const connection = new HubConnectionBuilder()
        .withUrl("https://scrum-poker-online-api.fly.dev/scrum-poker-online")
        .configureLogging(LogLevel.Information)
        .build()

      // Receive the updated users
      connection.on('UpdateUsers', (newUsersInfo: UsersInfo) => {
        console.log('UpdateUsers', newUsersInfo)
        setUsersInfo(newUsersInfo)
      })

      // Receive the new card values
      connection.on('ReceiveCardValue', (name: string, value: string) => {
        console.log('ReceiveCardValue', name, value)
        setUsersInfo(usersInfo => usersInfo.map(userInfo => userInfo?.name === name ? { ...userInfo, value } : userInfo))
      })

      // Start connection
      await connection.start()
      // Call the join scrum poker game for this user
      await connection.invoke("JoinScrumPoker", { game, name: userName })
      setUser({ name: userName, game, value: '' })

      setConnection(connection)
      // connection.on("JoinScrumPoker", { game: 'test', name })
    } catch (e) {
      console.log(e)
    }
  }

  const handleCardClick = async (value: string): Promise<void> => {
    try {
      if (connection && value != user?.value) {
        console.log('handleCardClick', value)
        // Call the select card for this user
        await connection.invoke("SelectCardValue", value)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div style={{}}>
      <div style={{ display: 'flex', justifyContent: 'center', position: 'fixed', left: 0, right: 0, top: 0, marginTop: 25 }}>
        <UserForm userName={user?.name} onFormSubmit={handleFormSubmit} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CentralTable usersInfo={usersInfo} />
      </div>
      <div className='cards-container'>
        <Cards onCardClick={handleCardClick} />
      </div>
    </div>
  )
}

export default App
