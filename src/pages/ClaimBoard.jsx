function ChoreCard({ chore, onClaim }) {
  return (
    <div className='card claim-card'>
      <div className='claim-card-header'>
        <p className='claim-task'>{chore.task}</p>
        <span className='points-badge'>{chore.points} pts</span>
      </div>
      <p className='owner-label'>Added by {chore.addedBy}</p>
      {chore.date && <p className='owner-label'>Due {chore.date}</p>}
      <button type='button' onClick={() => onClaim(chore.id)}>
        Claim this chore
      </button>
    </div>
  )
}

function ClaimedCard({ chore, onUnclaim }) {
  return (
    <div className='card claim-card claimed'>
      <div className='claim-card-header'>
        <p className='claim-task'>{chore.task}</p>
        <span className='points-badge'>{chore.points} pts</span>
      </div>
      <p className='owner-label'>Claimed by you</p>
      {chore.date && <p className='owner-label'>On your calendar: {chore.date}</p>}
      <button type='button' className='unclaim-button' onClick={() => onUnclaim(chore.id)}>
        Unclaim
      </button>
    </div>
  )
}

function AddChoreForm({ onAdd }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const task = form.task.value.trim()
    const points = Number(form.points.value)
    const date = form.date.value

    if (!task) return

    onAdd({ task, points, date })
    form.reset()
  }

  return (
    <form className='add-chore-form card' onSubmit={handleSubmit}>
      <h3>Add a chore to the board</h3>
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

        <label>
          Date
          <input type='date' name='date' required />
        </label>
      </div>

      <button type='submit'>Add to claim board</button>
    </form>
  )
}

export default function ClaimBoard({ openChores, claimedChores, onAdd, onClaim, onUnclaim }) {
  return (
    <>
      <h2 className='page-title'>Claim Board</h2>
      <p className='page-subtitle'>
        Grab any open chore before someone else does, or add one that needs doing.
        Claimed chores automatically show up on your calendar on the date you picked.
      </p>

      <AddChoreForm onAdd={onAdd} />

      <div className='claim-board'>
        <div className='claim-column'>
          <h3>Open ({openChores.length})</h3>
          {openChores.length === 0 && (
            <p className='empty-state'>No open chores right now.</p>
          )}
          <div className='claim-list'>
            {openChores.map((chore) => (
              <ChoreCard key={chore.id} chore={chore} onClaim={onClaim} />
            ))}
          </div>
        </div>

        <div className='claim-column'>
          <h3>Claimed by you ({claimedChores.length})</h3>
          {claimedChores.length === 0 && (
            <p className='empty-state'>You haven't claimed anything yet.</p>
          )}
          <div className='claim-list'>
            {claimedChores.map((chore) => (
              <ClaimedCard key={chore.id} chore={chore} onUnclaim={onUnclaim} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
