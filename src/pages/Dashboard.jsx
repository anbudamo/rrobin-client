import { doesChoreOccurOnDate, addDays } from '../utils/chores'

const members = [
  {
    id: 1,
    name: 'Anbu Damodaran',
    initials: 'AD',
    today: ['Take out recycling'],
    tomorrow: ['Wash dishes', 'Water plants'],
    thisWeek: ['Buy toilet paper', 'Vacuum the living room'],
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

// Looks at chores placed on the calendar (including recurring ones) and buckets
// them into Today / Tomorrow / This Week for the given member, based on the
// current real-world date.
function getDynamicTasks(memberName, calendarChores) {
  const today = new Date()
  const relevant = calendarChores.filter((chore) => chore.addedBy === memberName)

  const todayTasks = []
  const tomorrowTasks = []
  const thisWeekTasks = []

  relevant.forEach((chore) => {
    if (doesChoreOccurOnDate(chore, today)) {
      todayTasks.push(chore.task)
    }
    if (doesChoreOccurOnDate(chore, addDays(today, 1))) {
      tomorrowTasks.push(chore.task)
    }
    for (let offset = 2; offset <= 6; offset++) {
      if (doesChoreOccurOnDate(chore, addDays(today, offset))) {
        thisWeekTasks.push(chore.task)
        break
      }
    }
  })

  return { todayTasks, tomorrowTasks, thisWeekTasks }
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

function Card({ member }) {
  return (
    <div className='card'>
      <h2>{member.name}</h2>

      <div className='task-list'>
        <h3>Today</h3>
        <ul>
          {member.today.map((task, idx) => (
            <li key={`${task}-${idx}`}>
              <label>
                <input type='checkbox' />
                {task}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className='task-list'>
        <h3>Tomorrow</h3>
        <ul>
          {member.tomorrow.map((task, idx) => (
            <li key={`${task}-${idx}`}>
              <label>
                <input type='checkbox' />
                {task}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className='task-list'>
        <h3>This Week</h3>
        <ul>
          {member.thisWeek.map((task, idx) => (
            <li key={`${task}-${idx}`}>
              <label>
                <input type='checkbox' />
                {task}
              </label>
            </li>
          ))}
        </ul>
      </div>

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
          <p className='owner-label'>Not scheduled yet — assign a date on the Calendar page.</p>
        </div>
      )}
    </div>
  )
}

function Board({ members }) {
  return (
    <div className='board'>
      {members.map((member) => (
        <Card key={member.id} member={member} />
      ))}
    </div>
  )
}

export default function Dashboard({ name, calendarChores = [], claimedChores = [] }) {
  const tasksDueToday = 0
  const pendingTasksDue = 2

  const mergedMembers = members.map((member) => {
    const dynamic = getDynamicTasks(member.name, calendarChores)
    const looseChores = claimedChores.filter(
      (chore) => chore.claimedBy === member.name && !chore.date
    )

    return {
      ...member,
      today: [...member.today, ...dynamic.todayTasks],
      tomorrow: [...member.tomorrow, ...dynamic.tomorrowTasks],
      thisWeek: [...member.thisWeek, ...dynamic.thisWeekTasks],
      looseChores,
    }
  })

  return (
    <>
      <h2 className='page-title'>Hi {name}, welcome to your dashboard!</h2>
      <Stats tasksDueToday={tasksDueToday} pendingTasksDue={pendingTasksDue} />
      <Board members={mergedMembers} />
    </>
  )
}
