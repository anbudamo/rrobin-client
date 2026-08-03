import robinImage from '../assets/robin.webp'

export default function GroupCodePage({ group, onContinue }) {
  return (
    <>
      <header className='logo'>
        <img className='logo-image' src={robinImage} alt='Round Robin bird logo' />
        <h2>Round Robin</h2>
      </header>

      <div className='claim-board'>
        <section className='claim-column card'>
          <h2>Join at</h2>
          <h3>www.roundrobin.com</h3>
        </section>

        <section className='claim-column'>
          <div className='card'>
            <h2>Group code ready!</h2>
            <h1>{group.inviteCode}</h1>
            <p>Share this code with your group to join {group.name}.</p>
          </div>

          <div className='add-chore-form'>
            <button type='button' onClick={onContinue}>Go to dashboard →</button>
          </div>
        </section>
      </div>
    </>
  )
}
