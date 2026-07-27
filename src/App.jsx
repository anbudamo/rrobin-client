import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Trade from './pages/Trade'
import robinImage from './assets/robin.webp'

const inviteCode = '330 258'

function Header({ onProfileClick, onNotificationsClick }) {
  return (
    <header className='app-header'>
      <button
        className='notification-button'
        type='button'
        aria-label='View notifications'
        onClick={onNotificationsClick}
      />
      <button
        className='profile-button'
        type='button'
        aria-label='Open settings'
        onClick={onProfileClick}
      />
    </header>
  )
}

function Sidebar({ onNavClick }) {
  return (
    <div className='sidebar'>
      <div className='logo'>
        <img className="logo-image" src={robinImage} alt="Round Robin bird logo" />
        <span>Round Robin</span>
      </div>

      <div className='group-selector'>
        <h4>Group Selector</h4>
        <select>
          <option>Unit #309</option>
        </select>
      </div>

      <div className='navigation'>
        <h4>Navigation</h4>
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
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className='app-layout'>
      <Sidebar onNavClick={setActiveNav} />

      <main className='page-content'>
        <Header/>
        {showNotifications && <p className='notification-message'>No new notifications.</p>}
        {activeNav === 'dashboard' && <Dashboard name="Anbu" />}
        {activeNav === 'swap' && <Trade />}
        {activeNav === 'settings' && <Settings />}
      </main>
    </div>
  )
}
