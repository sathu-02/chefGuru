import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from './Pages/Chat/Chat'
import Sidebar from './Components/Sidebar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='sidebar'>
      <Sidebar/>
    </div>
    <div className="chat">
      <Chat/>
    </div>
      
    </>
  )
}

export default App
