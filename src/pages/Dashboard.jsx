import { formatDateKey, doesChoreOccurOnDate, addDays, DONE_RETENTION_MS } from '../utils/chores'

const CURRENT_USER = 'Anbu Damodaran'

const members = [
  {
    id: 1,
    name: 'Anbu Damodaran',
    initials: 'AD',
    today: [],
    tomorrow: [],
    thisWeek: [],
  },
  {
    id: 2,
    name: 'Jacob Knowlton',
    initials: 'JK',
    today: ['Wipe kitchen counters'],
    tomorrow: ['Walk the dog', 'Clean the bathroom mirror'],
    thisWeek: ['Pick up groceries', 'Mop the hallway'],
  },
  {
    id: 3,
    name: 'Adam Kazi',
    initials: 'AK',
    today: ['Sort the mail'],
    tomorrow: ['Empty the dishwasher', 'Take out trash'],
    thisWeek: ['Change bed sheets', 'Clean the fridge shelf'],
  },
]

// Buckets a member's real dated chores (from the calendar AND their claimed
// chores) into Today / Tomorrow / This Week. Returns rich objects that carry
// enough identity (id, source, dateKey) for the checkbox to mark them done.
// Finished occurrences are already filtered out by doesChoreOccurOnDate.
function getDynamicTasks(memberName, calendarChores, claimedChores) {
  const today = new Date()

  const owned = [
    ...calendarChores
      .filter((c) => c.addedBy === memberName)
      .map((c) => ({ ...c, source: 'calendar' })),
    ...claimedChores
      .filter((c) => c.claimedBy === memberName && c.date)
      .map((c) => ({ ...c, source: 'claimed' })),
  ]

  const mk = (chore, dateObj) => ({
    id: chore.id,
    task: chore.task,
    source: chore.source,
    recurring: chore.recurring,
    dateKey: formatDateKey(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
  })

  const todayTasks = []
  const tomorrowTasks = []
  const thisWeekTasks = []

  owned.forEach((chore) => {
    if (doesChoreOccurOnDate(chore, today)) {
      todayTasks.push(mk(chore, today))
    }
    const tmr = addDays(today, 1)
    if (doesChoreOccurOnDate(chore, tmr)) {
      tomorrowTasks.push(mk(chore, tmr))
    }
    for (let offset = 2; offset <= 6; offset++) {
      const d = addDays(today, offset)
      if (doesChoreOccurOnDate(chore, d)) {
        thisWeekTasks.push(mk(chore, d))
        break
      }
    }
  })

  return { todayTasks, tomorrowTasks, thisWeekTasks }
}

// "3h ago", "just now", "2d ago"
function timeAgo(timestamp) {
  const mins = Math.floor((Date.now() - timestamp) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function hoursUntilRemoved(timestamp) {
  const ms = DONE_RETENTION_MS - (Date.now() - timestamp)
  return Math.max(0, Math.ceil(ms / 3600000))
}

function Stats({ tasksDueToday, pendingTasksDue }) {
  return (
    <div className='stats'>
      <div className='stat'>
        <span className='stat-value'>{tasksDueToday}</span>
        <p className='stat-label'>Tasks due today</p>
      </div>

      <div className='stat'>
        <span className='stat-value'>{pendingTasksDue}</span>
        <p className='stat-label'>Pending tasks due</p>
      </div>
    </div>
  )
}

// One row in a task bucket. Your own chores get a styled, working checkbox;
// housemates' chores are read-only (you're not the one doing them).
function TaskRow({ item, isMe, onMarkDone }) {
  if (!isMe) {
    const text = typeof item === 'string' ? item : item.task
    return <li className='dash-task-readonly'>{text}</li>
  }

  return (
    <li className='dash-task'>
      <label>
        <input
          type='checkbox'
          className='dash-check'
          onChange={() => onMarkDone(item.id, item.source, item.dateKey)}
        />
        <span>{item.task}</span>
      </label>
    </li>
  )
}

function TaskBucket({ title, items, isMe, onMarkDone }) {
  return (
    <div className='task-list'>
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className='empty-state'>Nothing here.</p>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <TaskRow
              key={typeof item === 'string' ? `${item}-${idx}` : `${item.source}-${item.id}-${item.dateKey}`}
              item={item}
              isMe={isMe}
              onMarkDone={onMarkDone}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function Card({ member, onMarkDone }) {
  return (
    <div className='card'>
      <h2>{member.isMe ? 'You' : member.name}</h2>

      <TaskBucket title='Today' items={member.today} isMe={member.isMe} onMarkDone={onMarkDone} />
      <TaskBucket title='Tomorrow' items={member.tomorrow} isMe={member.isMe} onMarkDone={onMarkDone} />
      <TaskBucket title='This Week' items={member.thisWeek} isMe={member.isMe} onMarkDone={onMarkDone} />

      {member.looseChores.length > 0 && (
        <div className='task-list loose-task-list'>
          <h3>Loose Chores</h3>
          <ul>
            {member.looseChores.map((chore) => (
              <li key={chore.id} className='loose-chore-item'>
                <span className='claim-task'>{chore.task}</span>
                <span className='points-badge'>{chore.points} pts</span>
              </li>
            ))}
          </ul>
          <p className='owner-label'>Not assigned date on the Calendar page!</p>
        </div>
      )}
    </div>
  )
}

function Board({ members, onMarkDone }) {
  return (
    <div className='board'>
      {members.map((member) => (
        <Card key={member.id} member={member} onMarkDone={onMarkDone} />
      ))}
    </div>
  )
}

// Chores finished anywhere in the app land here, newest first, and clear
// themselves out 48 hours after they were completed.
function FinishedSection({ finishedChores }) {
  return (
    <div className='finished-section'>
      <h3>Finished</h3>
      <p className='page-subtitle'>
        Chores completed in the last 48 hours. Each one clears automatically after that.
      </p>

      {finishedChores.length === 0 ? (
        <p className='empty-state'>Nothing finished yet. Mark a chore done to see it here.</p>
      ) : (
        <div className='finished-list'>
          {finishedChores.map((item) => (
            <div key={item.key} className='card finished-item'>
              <div className='finished-main'>
                <span className='finished-check'>&#10003;</span>
                <span className='finished-task'>{item.task}</span>
                {typeof item.points === 'number' && (
                  <span className='points-badge'>{item.points} pts</span>
                )}
              </div>
              <span className='finished-meta'>
                done {timeAgo(item.completedAt)} · clears in {hoursUntilRemoved(item.completedAt)}h
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard({
  name,
  calendarChores = [],
  claimedChores = [],
  finishedChores = [],
  onMarkDone = () => {},
}) {
  const mergedMembers = members.map((member) => {
    const isMe = member.name === CURRENT_USER
    const dynamic = getDynamicTasks(member.name, calendarChores, claimedChores)
    const looseChores = claimedChores.filter(
      (chore) => chore.claimedBy === member.name && !chore.date && !chore.completedAt
    )

    // Your card shows only your real chores (checkable). Housemates keep
    // sample tasks until there's real multi-user data — and no checkboxes.
    if (isMe) {
      return {
        ...member,
        isMe,
        today: dynamic.todayTasks,
        tomorrow: dynamic.tomorrowTasks,
        thisWeek: dynamic.thisWeekTasks,
        looseChores,
      }
    }

    return {
      ...member,
      isMe,
      today: [...member.today, ...dynamic.todayTasks],
      tomorrow: [...member.tomorrow, ...dynamic.tomorrowTasks],
      thisWeek: [...member.thisWeek, ...dynamic.thisWeekTasks],
      looseChores,
    }
  })

  const me = mergedMembers.find((m) => m.isMe)
  const tasksDueToday = me ? me.today.length : 0
  const pendingTasksDue = me ? me.tomorrow.length + me.thisWeek.length : 0

  return (
    <>
      <h2 className='page-title'>Hi {name}, welcome to your dashboard!</h2>
      <Stats tasksDueToday={tasksDueToday} pendingTasksDue={pendingTasksDue} />
      <Board members={mergedMembers} onMarkDone={onMarkDone} />
      <FinishedSection finishedChores={finishedChores} />
    </>
  )
}
