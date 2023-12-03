import './app.css'
import { useContext, useEffect } from 'react'
import CentralTable from './components/CentralTable'
import PokerCards from './components/PokerCards'
import UserForm from './components/UserForm'
import { useError } from './hooks/useError'
import { GameContext } from './contexts/GameContext'
import GameInfo from './components/GameInfo'
import { HubConnectionContext } from './contexts/HubConnectionContext'
import { useHubInvokeMethods } from './hooks/useHubInvokeMethods'
import { HubInvokeMethodsEnum } from './enums'
import { useHubReceiveMethods } from './hooks/useHubReceiveMethods'
import { Room } from './types'
import { updateUrlWithoutRefresh } from './helpers'
import PokerIssues from './components/PokerIssues'

function App() {
  const { room, setRoom, user, userId, leaveRoom } = useContext(GameContext)
  const { connection } = useContext(HubConnectionContext)

  const { invokeHubMethod } = useHubInvokeMethods()
  const { createAllReceiveMethods } = useHubReceiveMethods()
  const { error } = useError()
  const isUserInGame = !!(room && user)

  useEffect(() => {
    // After a page refresh room info is lost so,
    // if userId exists and does not have room, try to retrieve room info
    if (connection && userId.current && !room) {
      invokeHubMethod(HubInvokeMethodsEnum.RetrieveUserRoom, userId.current).then((retrievedRoom: Room) => {
        updateUrlWithoutRefresh(retrievedRoom.id)
        createAllReceiveMethods()
        setRoom(retrievedRoom)
      }).catch(() => {
        leaveRoom()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection])

  return (
    <div className='app-container'>
      <div className='app-principal-container'>
        <div className={`user-info-container ${isUserInGame ? 'user-info-container-in-game' : 'user-info-container-out-game'}`}>
          <h1>Scrum poke online</h1>
          {isUserInGame
            ? <GameInfo />
            : <UserForm />
          }
          {error && <span>{error}</span>}
        </div>
        {user && (
          <>
            <div className='central-table-container'>
              <CentralTable />
            </div>
            <div className='cards-container'>
              <PokerCards />
            </div>
          </>
        )}
      </div>
      {isUserInGame && (
        <PokerIssues />
      )}
    </div>
  )
}

export default App
