
function Column({ title }) {
  return (
    <div className='column'>
      <h3>{title}</h3>
    </div>
  )
}

function TradeBoard() {
  return (
    <div className='trade-board'>
      <Column title="Mine" />
      <Column title="Others" />
    </div>
  )
}

export default function Trade() {
  return (
    <>
      <h2 className='page-title'>Use the Trade board to trade any chores</h2>
      <TradeBoard />
    </>
  )
}
