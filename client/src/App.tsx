import './app.css'
import { useContext } from 'react'
import CentralTable from './components/CentralTable'
import PokerCards from './components/PokerCards'
import UserForm from './components/UserForm'
import { useError } from './hooks/useError'
import { GameContext } from './contexts/GameContext'
import GameInfo from './components/GameInfo'

function App() {
  const { room, user } = useContext(GameContext)

  const { error } = useError()
  const isUserInGame = !!(room && user)

  return (
    <div style={{}}>
      <div className='user-form-container'>
        {isUserInGame
          ? <GameInfo />
          : <UserForm />
        }
        {error && <p>{error}</p>}
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
  )
}

export default App
