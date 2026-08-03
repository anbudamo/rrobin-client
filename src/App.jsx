import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Trade from './pages/Trade'
import ClaimBoard from './pages/ClaimBoard'
import CalendarPage from './pages/CalendarPage'
import Landing from './pages/onboarding/Landing'
import Code from './pages/onboarding/GroupCode'
import robinImage from './assets/robin.webp'

const initialOpenChores = [
  { id: 1, task: 'Take out recycling', points: 2, date: '', addedBy: 'Anbu Damodaran' },
  { id: 2, task: 'Mop the hallway', points: 3, date: '', addedBy: 'Jacob Knowlton' },
  { id: 3, task: 'Clean the fridge shelf', points: 4, date: '', addedBy: 'Adam Kazi' },
]

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

function Sidebar({ onNavClick, group }) {
  return (
    <div className='sidebar'>
      <div className='logo'>
        <img className="logo-image" src={robinImage} alt="Round Robin bird logo" />
        <span>Round Robin</span>
      </div>

      <div className='group-selector'>
        <h4>Group Selector</h4>
        <select>
          <option>{group.name}</option>
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

          <button type="button" onClick={() => onNavClick('claimboard')}>
            Claim Board
          </button>

          <button type="button" onClick={() => onNavClick('calendar')}>
            Calendar
          </button>

          <button type="button" onClick={() => onNavClick('settings')}>
            Settings
          </button>
        </nav>
      </div>

      <div className='invite-code'>
        <h4>Invite Code</h4>
        <p>{group.inviteCode}</p>
      </div>

    </div>

  )
}

export default function App() {
  const currentUser = 'Anbu Damodaran'
  const [group, setGroup] = useState({ name: 'Unit #309', inviteCode: '330 258' })

  // This state remembers which navigation button was clicked.
  const [activeNav, setActiveNav] = useState('landing')
  const [showNotifications, setShowNotifications] = useState(false)

  const handleUserJoin = () => setActiveNav('dashboard')

  const handleUserCreate = (name) => {
    const inviteCode = `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`
    setGroup({ name, inviteCode })
    setActiveNav('groupCode')
  }

  // Chore state lives here so both the Claim Board and Calendar can read/update it.
  const [openChores, setOpenChores] = useState(initialOpenChores)
  const [claimedChores, setClaimedChores] = useState([])

  const handleAddChore = ({ task, points, date }) => {
    const newChore = {
      id: Date.now(),
      task,
      points,
      date,
      addedBy: currentUser,
    }
    setOpenChores((prev) => [...prev, newChore])
  }

  const handleClaimChore = (id) => {
    const chore = openChores.find((c) => c.id === id)
    if (!chore) return

    setOpenChores((prev) => prev.filter((c) => c.id !== id))
    setClaimedChores((prev) => [...prev, { ...chore, claimedBy: currentUser }])
  }

  const handleUnclaimChore = (id) => {
    const chore = claimedChores.find((c) => c.id === id)
    if (!chore) return

    const rest = { ...chore }
    delete rest.claimedBy
    setClaimedChores((prev) => prev.filter((c) => c.id !== id))
    setOpenChores((prev) => [...prev, rest])
  }

  // Chores placed directly onto the calendar (optionally recurring).
  // Shared with Dashboard so they show up there too.
  const [calendarChores, setCalendarChores] = useState([])

  const handleAddCalendarChore = ({ task, points, date, recurring, intervalDays }) => {
    const newChore = {
      id: Date.now(),
      task,
      points,
      date,
      recurring,
      intervalDays,
      addedBy: currentUser,
    }
    setCalendarChores((prev) => [...prev, newChore])
  }

  // Removes just one occurrence of a (possibly recurring) chore, by recording
  // the clicked date as "excluded" without deleting the underlying chore.
  const handleRemoveOccurrence = (id, source, dateKey) => {
    const updater = (prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, excludedDates: [...(c.excludedDates || []), dateKey] }
          : c
      )

    if (source === 'calendar') {
      setCalendarChores(updater)
    } else {
      setClaimedChores(updater)
    }
  }

  // Deletes the chore entirely, removing every past/future occurrence.
  const handleRemoveChore = (id, source) => {
    if (source === 'calendar') {
      setCalendarChores((prev) => prev.filter((c) => c.id !== id))
    } else {
      setClaimedChores((prev) => prev.filter((c) => c.id !== id))
    }
  }

  // Assigns a date to a claimed chore that doesn't have one yet ("loose" chore).
  const handleScheduleChore = (id, date) => {
    setClaimedChores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, date } : c))
    )
  }

  // Dark mode state, initialized from localStorage so the choice persists across reloads.
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('roundrobin-theme')
    return saved === 'dark'
  })

  // Whenever darkMode changes, toggle the "dark" class on <html> and save the preference.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('roundrobin-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  if (activeNav === 'landing' || activeNav === 'groupCode') {
    return (
      <div className={`app-layout ${darkMode ? 'dark' : ''}`}>
        <main className='page-content'>
          {activeNav === 'landing' ? (
            <Landing onUserJoin={handleUserJoin} onUserCreate={handleUserCreate} />
          ) : (
            <Code group={group} onContinue={() => setActiveNav('dashboard')} />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className={`app-layout ${darkMode ? 'dark' : ''}`}>
      <Sidebar onNavClick={setActiveNav} group={group} />

      <main className='page-content'>
        <Header
          onProfileClick={() => setActiveNav('settings')}
          onNotificationsClick={() => setShowNotifications((prev) => !prev)}
        />
        {showNotifications && <p className='notification-message'>No new notifications.</p>}
        {activeNav === 'dashboard' && (
          <Dashboard name="Anbu" calendarChores={calendarChores} claimedChores={claimedChores} />
        )}
        {activeNav === 'swap' && <Trade />}
        {activeNav === 'claimboard' && (
          <ClaimBoard
            openChores={openChores}
            claimedChores={claimedChores}
            onAdd={handleAddChore}
            onClaim={handleClaimChore}
            onUnclaim={handleUnclaimChore}
          />
        )}
        {activeNav === 'calendar' && (
          <CalendarPage
            claimedChores={claimedChores}
            calendarChores={calendarChores}
            onAddCalendarChore={handleAddCalendarChore}
            onRemoveOccurrence={handleRemoveOccurrence}
            onRemoveChore={handleRemoveChore}
            onScheduleChore={handleScheduleChore}
          />
        )}
        {activeNav === 'settings' && (
          <Settings darkMode={darkMode} onToggleTheme={() => setDarkMode((prev) => !prev)} />
        )}
      </main>
    </div>
  )
}
