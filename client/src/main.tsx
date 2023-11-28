import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { HubConnectionContextProvider } from './contexts/HubConnectionContext.tsx'
import { GameContextProvider } from './contexts/GameContext.tsx'
import { ErrorContextProvider } from './contexts/ErrorContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HubConnectionContextProvider>
    <GameContextProvider>
      <ErrorContextProvider>
        <App />
      </ErrorContextProvider>
    </GameContextProvider>
  </HubConnectionContextProvider>
)
