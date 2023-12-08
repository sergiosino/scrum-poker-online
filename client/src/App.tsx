import './app.css'
import { useContext } from 'react'
import InitialFormView from './views/InitialFormView'
import { RoomContext } from './contexts/RoomContext'
import GameView from './views/GameView'

function App() {
  const { room } = useContext(RoomContext)

  const isUserInGame = !!room

  return (
    <div className='app-container'>
      {isUserInGame ? (
        <GameView />
      ): (
        <InitialFormView />
      )}
    </div>
  )
}

export default App
