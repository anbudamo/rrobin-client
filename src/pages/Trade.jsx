import { useState } from 'react'

const initialMine = [
  { id: 1, task: 'Take out recycling', status: 'assigned' },
  { id: 2, task: 'Wash dishes', status: 'assigned' },
]

const initialOthers = [
  { id: 3, task: 'Mop the hallway', owner: 'Jacob Knowlton', status: 'available' },
  { id: 4, task: 'Clean the fridge shelf', owner: 'Adam Kazi', status: 'available' },
]

function Column({ title, children }) {
  return (
    <div className='column'>
      <h3>{title}</h3>
      {children}
    </div>
  )
}

function MineChore({ chore, onOffer }) {
  return (
    <div className='card' style={{ marginBottom: '16px' }}>
      <p>{chore.task}</p>
      {chore.status === 'assigned' ? (
        <button type='button' onClick={() => onOffer(chore.id)}>
          Offer to trade
        </button>
      ) : (
        <span className='status-tag'>Pending swap</span>
      )}
    </div>
  )
}

function OtherChore({ chore, onClaim }) {
  return (
    <div className='card' style={{ marginBottom: '16px' }}>
      <p>{chore.task}</p>
      <p className='owner-label'>Offered by {chore.owner}</p>
      <button type='button' onClick={() => onClaim(chore.id)}>
        Request swap
      </button>
    </div>
  )
}

function TradeChoreForm({ calendarChores = [], onPutUpForTrade }) {
  const [selectedChoreId, setSelectedChoreId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedChoreId) return

    const selectedChore = calendarChores.find(
      (chore) => String(chore.id) === String(selectedChoreId)
    )

    if (selectedChore && onPutUpForTrade) {
      onPutUpForTrade(selectedChore)
    }

    setSelectedChoreId('')
  }

  return (
    <form className='add-chore-form card' style={{ marginBottom: '24px' }} onSubmit={handleSubmit}>
      <h3>Put a calendar chore up for trade</h3>
      <div className='form-row'>
        <label>
          Select Chore
          <select
            value={selectedChoreId}
            onChange={(e) => setSelectedChoreId(e.target.value)}
            required
          >
            <option value='' disabled>
              -- Choose a chore from your calendar --
            </option>
            {calendarChores.map((chore) => (
              <option key={chore.id} value={chore.id}>
                {chore.task} {chore.date ? `(Due ${chore.date})` : ''}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type='submit' disabled={calendarChores.length === 0}>
        Put up for trade
      </button>
    </form>
  )
}

function TradeBoard({ mine, others, onOffer, onClaim }) {
  return (
    <div className='trade-board'>
      <Column title='Mine'>
        {mine.map((chore) => (
          <MineChore key={chore.id} chore={chore} onOffer={onOffer} />
        ))}
      </Column>

      <Column title='Others'>
        {others.map((chore) => (
          <OtherChore key={chore.id} chore={chore} onClaim={onClaim} />
        ))}
      </Column>
    </div>
  )
}

export default function Trade({ calendarChores = [], onPutUpForTrade }) {
  const [mine, setMine] = useState(initialMine)
  const [others, setOthers] = useState(initialOthers)

  const handleOffer = (id) => {
    setMine((prev) =>
      prev.map((chore) =>
        chore.id === id ? { ...chore, status: 'pending' } : chore
      )
    )
  }

  const handleClaim = (id) => {
    setOthers((prev) => prev.filter((chore) => chore.id !== id))
  }

  const handleFormTrade = (selectedChore) => {
    // Add selected chore to 'mine' column with 'pending' status
    setMine((prev) => [
      ...prev,
      { id: selectedChore.id, task: selectedChore.task, status: 'pending' },
    ])

    if (onPutUpForTrade) {
      onPutUpForTrade(selectedChore)
    }
  }

  return (
    <>
      <h2 className='page-title'>Use the Trade board to trade any chores</h2>

      {/* Trade Form Section */}
      <TradeChoreForm
        calendarChores={calendarChores}
        onPutUpForTrade={handleFormTrade}
      />

      {/* Trade Board Columns */}
      <TradeBoard mine={mine} others={others} onOffer={handleOffer} onClaim={handleClaim} />
    </>
  )
}