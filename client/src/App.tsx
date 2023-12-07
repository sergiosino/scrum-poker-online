import './app.css'
import { useContext } from 'react'
import CentralTable from './components/CentralTable'
import PokerCards from './components/cards/PokerCards'
import UserForm from './components/UserForm'
import { RoomContext } from './contexts/RoomContext'
import GameInfo from './components/GameInfo'
import PokerIssues from './components/issues/PokerIssues'

function App() {
  const { room } = useContext(RoomContext)

  const isUserInGame = !!room

  return (
    <div className='app-container'>
      <div className='app-principal-container'>
        <div className={`user-info-container ${isUserInGame ? 'user-info-container-in-game' : 'user-info-container-out-game'}`}>
          {isUserInGame
            ? <GameInfo />
            : <UserForm />
          }
        </div>
        {isUserInGame && (
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
