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
    <div className='card'>
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
    <div className='card'>
      <p>{chore.task}</p>
      <p className='owner-label'>Offered by {chore.owner}</p>
      <button type='button' onClick={() => onClaim(chore.id)}>
        Request swap
      </button>
    </div>
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

export default function Trade() {
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

  return (
    <>
      <h2 className='page-title'>Use the Trade board to trade any chores</h2>
      <TradeBoard mine={mine} others={others} onOffer={handleOffer} onClaim={handleClaim} />
    </>
  )
}