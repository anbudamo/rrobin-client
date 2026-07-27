const members = [
  { id: 1, name: 'Anbu Damodaran', initials: 'AD' },
  { id: 2, name: 'Jacob Knowlton', initials: 'JK' },
  { id: 3, name: 'Adam Kazi', initials: 'AK' },
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
      <div className='card-avatar'>{member.initials}</div>
      <h2>{member.name}</h2>

      <div className='task-list'>
        <h3>Today</h3>
        <input type='checkbox' aria-label='Today task' />
      </div>

      <div className='task-list'>
        <h3>Tomorrow</h3>
        <input type='checkbox' aria-label='Tomorrow task' />
      </div>

      <div className='task-list'>
        <h3>This Week</h3>
        <input type='checkbox' aria-label='This Week task' />
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
      <h2>Hi {name}, welcome to your dashboard!</h2>
      <Stats tasksDueToday={tasksDueToday} pendingTasksDue={pendingTasksDue} />
      <Board members={members} />
    </>
  )
}
