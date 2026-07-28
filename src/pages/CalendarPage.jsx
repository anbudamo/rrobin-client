import { useState } from 'react'
import { formatDateKey, doesChoreOccurOnDate } from '../utils/chores'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const intervalOptions = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: n,
  label: `Every ${n} day${n > 1 ? 's' : ''}`,
}))
intervalOptions.push({ value: 7, label: 'Every week' })

function AddCalendarChoreForm({ date, onAdd, onCancel }) {
  const [recurring, setRecurring] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const task = form.task.value.trim()
    const points = Number(form.points.value)
    const intervalDays = recurring ? Number(form.interval.value) : null

    if (!task) return

    onAdd({ task, points, recurring, intervalDays })
    form.reset()
    setRecurring(false)
  }

  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <form className='add-chore-form card' onSubmit={handleSubmit}>
      <h3>Add a chore for {formattedDate}</h3>

      <div className='form-row'>
        <label>
          Chore name
          <input
            type='text'
            name='task'
            placeholder='e.g. Water the plants'
            required
          />
        </label>

        <label>
          Difficulty (points)
          <select name='points' defaultValue={1}>
            <option value={1}>1 - Easy</option>
            <option value={2}>2 - Light</option>
            <option value={3}>3 - Moderate</option>
            <option value={4}>4 - Hard</option>
            <option value={5}>5 - Heavy</option>
          </select>
        </label>
      </div>

      <div className='form-row'>
        <label className='checkbox-label'>
          <input
            type='checkbox'
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
          Make this chore re-occur
        </label>

        {recurring && (
          <label>
            Repeat frequency
            <select name='interval' defaultValue={1}>
              {intervalOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className='form-buttons'>
        <button type='submit'>Add to calendar</button>
        <button type='button' className='cancel-button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function RemoveChorePanel({ target, onRemoveOccurrence, onRemoveChore, onCancel }) {
  return (
    <div className='add-chore-form card'>
      <h3>Remove "{target.task}"?</h3>

      <div className='form-buttons'>
        {target.recurring && (
          <button type='button' onClick={onRemoveOccurrence}>
            Remove this date only
          </button>
        )}
        <button type='button' className='danger-button' onClick={onRemoveChore}>
          {target.recurring ? 'Remove chore & all occurrences' : 'Remove this chore'}
        </button>
        <button type='button' className='cancel-button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function LooseChoreItem({ chore, onSchedule }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const date = e.target.date.value
    if (!date) return
    onSchedule(chore.id, date)
    e.target.reset()
  }

  return (
    <div className='card claim-card'>
      <div className='claim-card-header'>
        <p className='claim-task'>{chore.task}</p>
        <span className='points-badge'>{chore.points} pts</span>
      </div>
      <p className='owner-label'>No date assigned yet</p>
      <form className='schedule-form' onSubmit={handleSubmit}>
        <input type='date' name='date' required />
        <button type='submit'>Schedule</button>
      </form>
    </div>
  )
}

function LooseChores({ chores, onSchedule }) {
  return (
    <div className='loose-chores-section'>
      <h3>Loose Chores</h3>
      <p className='page-subtitle'>
        Chores you've claimed that haven't been put on a date yet.
      </p>

      {chores.length === 0 ? (
        <p className='empty-state'>
          You don't have any loose chores right now!
        </p>
      ) : (
        <div className='claim-list loose-chores-list'>
          {chores.map((chore) => (
            <LooseChoreItem key={chore.id} chore={chore} onSchedule={onSchedule} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CalendarPage({
  claimedChores = [],
  calendarChores = [],
  onAddCalendarChore,
  onRemoveOccurrence,
  onRemoveChore,
  onScheduleChore,
}) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selectedDate, setSelectedDate] = useState(null)
  const [removalTarget, setRemovalTarget] = useState(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth()

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const handleToday = () =>
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

  const handleDayClick = (day) => {
    if (!day) return
    setRemovalTarget(null)
    setSelectedDate(new Date(year, month, day))
  }

  const handleAddChore = ({ task, points, recurring, intervalDays }) => {
    if (!selectedDate) return
    const dateKey = formatDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )
    onAddCalendarChore({ task, points, date: dateKey, recurring, intervalDays })
    setSelectedDate(null)
  }

  const handleChoreClick = (chore, dateKey, e) => {
    e.stopPropagation()
    setSelectedDate(null)
    setRemovalTarget({ ...chore, dateKey })
  }

  const handleConfirmRemoveOccurrence = () => {
    if (!removalTarget) return
    onRemoveOccurrence(removalTarget.id, removalTarget.source, removalTarget.dateKey)
    setRemovalTarget(null)
  }

  const handleConfirmRemoveChore = () => {
    if (!removalTarget) return
    onRemoveChore(removalTarget.id, removalTarget.source)
    setRemovalTarget(null)
  }

  const allChores = [
    ...claimedChores.map((c) => ({ ...c, source: 'claimed' })),
    ...calendarChores.map((c) => ({ ...c, source: 'calendar' })),
  ]

  const looseChores = claimedChores.filter((chore) => !chore.date)

  const cells = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day)
  }

  return (
    <>
      <h2 className='page-title'>Calendar</h2>
      <p className='page-subtitle'>
        Click any date to add a chore to it, or click a chore to remove it.
      </p>

      <div className='calendar-header'>
        <button type='button' onClick={handlePrevMonth} aria-label='Previous month'>
          &larr; Prev
        </button>

        <div className='calendar-month-label'>
          <h3>{monthNames[month]} {year}</h3>
          {!isCurrentMonth && (
            <button type='button' className='today-button' onClick={handleToday}>
              Back to today
            </button>
          )}
        </div>

        <button type='button' onClick={handleNextMonth} aria-label='Next month'>
          Next &rarr;
        </button>
      </div>

      <div className='calendar-grid calendar-day-names'>
        {dayNames.map((name) => (
          <div key={name} className='calendar-day-name'>{name}</div>
        ))}
      </div>

      <div className='calendar-grid'>
        {cells.map((day, index) => {
          const isToday = isCurrentMonth && day === today.getDate()
          const cellDate = day ? new Date(year, month, day) : null
          const dateKey = day ? formatDateKey(year, month, day) : null
          const choresForDay = cellDate
            ? allChores.filter((chore) => doesChoreOccurOnDate(chore, cellDate))
            : []
          const hasClaimed = choresForDay.length > 0
          const isSelected =
            selectedDate &&
            day &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day

          return (
            <button
              type='button'
              key={index}
              disabled={!day}
              onClick={() => handleDayClick(day)}
              className={`calendar-cell ${day ? '' : 'empty'} ${isToday ? 'today' : ''} ${hasClaimed ? 'has-claimed' : ''} ${isSelected ? 'selected' : ''}`}
            >
              {day && (
                <>
                  <span className='calendar-day-number'>{day}</span>
                  <div className='calendar-chores'>
                    {choresForDay.map((chore) => (
                      <span
                        key={chore.id}
                        className='calendar-chore-tag claimed'
                        onClick={(e) => handleChoreClick(chore, dateKey, e)}
                      >
                        {chore.task}{chore.recurring ? ' \u21bb' : ''}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <AddCalendarChoreForm
          date={selectedDate}
          onAdd={handleAddChore}
          onCancel={() => setSelectedDate(null)}
        />
      )}

      {removalTarget && (
        <RemoveChorePanel
          target={removalTarget}
          onRemoveOccurrence={handleConfirmRemoveOccurrence}
          onRemoveChore={handleConfirmRemoveChore}
          onCancel={() => setRemovalTarget(null)}
        />
      )}

      <LooseChores chores={looseChores} onSchedule={onScheduleChore} />
    </>
  )
}
