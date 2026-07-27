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
          {member.today.map((task) => (
            <li key={task}>
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
          {member.tomorrow.map((task) => (
            <li key={task}>
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
          {member.thisWeek.map((task) => (
            <li key={task}>
              <label>
                <input type='checkbox' />
                {task}
              </label>
            </li>
          ))}
        </ul>
      </div>
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

export default function Dashboard({ name }) {
  const tasksDueToday = 0
  const pendingTasksDue = 2

  return (
    <>
      <h2 className='page-title'>Hi {name}, welcome to your dashboard!</h2>
      <Stats tasksDueToday={tasksDueToday} pendingTasksDue={pendingTasksDue} />
      <Board members={members} />
    </>
  )
}
