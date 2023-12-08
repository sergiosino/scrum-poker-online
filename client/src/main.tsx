import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { HubConnectionContextProvider } from './contexts/HubConnectionContext.tsx'
import { RoomContextProvider } from './contexts/RoomContext.tsx'
import { MessageContextProvider } from './contexts/MessageContext.tsx'
import { IssuesContextProvider } from './contexts/IssuesContext.tsx'
import { UsersContextProvider } from './contexts/UsersContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MessageContextProvider>
    <HubConnectionContextProvider>
      <RoomContextProvider>
        <UsersContextProvider>
          <IssuesContextProvider>
            <App />
          </IssuesContextProvider>
        </UsersContextProvider>
      </RoomContextProvider>
    </HubConnectionContextProvider>
  </MessageContextProvider>
)
