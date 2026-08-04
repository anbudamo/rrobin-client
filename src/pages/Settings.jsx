import { useState } from 'react'

export default function Settings({ darkMode, onToggleTheme, onLogout }) {
  const [notifications, setNotifications] = useState(true)

  return (
    <>
      <h2 className='page-title'>Settings</h2>

      <div className='card'>
        <h3>Profile</h3>
        <p>Name: Anbu Damodaran</p>
        <p>Role: Admin</p>
      </div>

      <div className='card'>
        <h3>Group</h3>
        <p>Unit #309</p>
        <p>Invite Code: 330 258</p>
        <button type='button'>Regenerate code</button>
      </div>

      <div className='card'>
        <h3>Appearance</h3>
        <div className='theme-toggle'>
          <button
            type='button'
            className={!darkMode ? 'active' : ''}
            onClick={() => darkMode && onToggleTheme()}
          >
            Light
          </button>
          <button
            type='button'
            className={darkMode ? 'active' : ''}
            onClick={() => !darkMode && onToggleTheme()}
          >
            Dark
          </button>
        </div>
      </div>

      <div className='card'>
        <h3>Notifications</h3>
        <label>
          <input
            type='checkbox'
            checked={notifications}
            onChange={() => setNotifications((prev) => !prev)}
          />
          Chore reminders
        </label>
      </div>

      <button type='button' className='logout-button' onClick={onLogout}>
        Log out
      </button>
    </>
  )
}
