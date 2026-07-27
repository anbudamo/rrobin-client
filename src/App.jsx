import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Trade from './pages/Trade'

const inviteCode = '330 258'

function Sidebar({ onNavClick }) {
  return (
    <div className='sidebar'>
      <div className='logo'>
        <img src="" alt="" />
        <span>Round Robin</span>
      </div>

      <div className='group-selector'>
        <h4>Group Selector</h4>
        <select>
          <option>Unit #309</option>
        </select>
      </div>

      <div className='navigation'>
        <nav>
          <button type="button" onClick={() => onNavClick('dashboard')}>
            Dashboard
          </button>

          <button type="button" onClick={() => onNavClick('swap')}>
            Swap
          </button>

          <button type="button" onClick={() => onNavClick('settings')}>
            Settings
          </button>
        </nav>
      </div>

      <div className='invite-code'>
        <h4>Invite Code</h4>
        <p>{inviteCode}</p>
      </div>
      
    </div>
    
  )
}

export default function App() {
  // This state remembers which navigation button was clicked.
  const [activeNav, setActiveNav] = useState('dashboard')

  return (
    <div className='app-layout'>
      <Sidebar onNavClick={setActiveNav} />

      <main className='page-content'>
        {activeNav === 'dashboard' && <Dashboard name="Anbu" />}
        {activeNav === 'swap' && <Trade />}
        {activeNav === 'settings' && <Settings />}
      </main>
    </div>
  )
}
