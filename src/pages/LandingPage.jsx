import robinImage from '../assets/robin.webp'
import { useRef, useState } from 'react'

// Possible forms shown in the modal.
const modes = {
  signUp: 'signup',
  signIn: 'signin',
  groupName: 'groupName',
}

// The two paths a user can choose on the landing page.
const groupActions = {
  join: 'join',
  create: 'create',
}

export default function LandingPage({ onUserJoin, onUserCreate }) {
  // Ref to the react modal
  const authDialogRef = useRef(null)

  // Tracks the current form in the modal
  const [modalView, setModalView] = useState(modes.signUp)

  // Remembers whether the user chose Join or Create
  const [selectedGroupAction, setSelectedGroupAction] = useState(null)

  // Saves the selected path (join or create), then opens the auth modal
  const handleOpenAuthModal = (event, groupAction) => {
    event.preventDefault()
    setSelectedGroupAction(groupAction)
    setModalView(modes.signUp)
    authDialogRef.current.showModal()
  }

  // Continues through either the Join or Create path
  const handleGroupAction = (groupName) => {
    if (selectedGroupAction === groupActions.join) {
      authDialogRef.current.close()
      onUserJoin()
      return
    }

    if (selectedGroupAction === groupActions.create) {
      if (!groupName) {
        setModalView(modes.groupName)
        return
      }

      authDialogRef.current.close()
      onUserCreate(groupName)
    }
  }

  const signupForm = (
    <form className='add-chore-form'>
      <h2>Create an account</h2>
      <label>Username<input type='text' name='username' /></label>
      <label>Email address<input type='email' name='email' /></label>
      <label>Password<input type='password' name='password' /></label>
      <label>Confirm password<input type='password' name='confirmPassword' /></label>
      <button type='button' onClick={() => handleGroupAction()}>Create account</button>
      <p>
        Already have an account?{' '}
        <button type='button' onClick={() => setModalView(modes.signIn)}>Sign in</button>
      </p>
    </form>
  )

  const loginForm = (
    <form className='add-chore-form'>
      <h2>Sign in</h2>
      <label>Username or email address<input type='text' name='login' /></label>
      <label>Password<input type='password' name='loginPassword' /></label>
      <button type='button' onClick={() => handleGroupAction()}>Sign in</button>
      <p>
        Need an account?{' '}
        <button type='button' onClick={() => setModalView(modes.signUp)}>Create account</button>
      </p>
    </form>
  )

  const groupNameForm = (
    <form
      className='add-chore-form'
      onSubmit={(event) => {
        event.preventDefault()
        handleGroupAction(event.currentTarget.groupName.value.trim())
      }}
    >
      <h2>Name your group</h2>
      <label>
        Group name
        <input type='text' name='groupName' placeholder='e.g. Unit #309' required />
      </label>
      <button type='submit'>Create group</button>
    </form>
  )

  return (
    <>
      <h1>Round Robin</h1>
      <p className='page-subtitle'>Chores made fair</p>

      <div className='claim-board'>
        <section className='claim-column'>
          <img className='logo-image' src={robinImage} alt='Round Robin bird logo' />
          <h2 className='page-title'>About</h2>
          <p className='page-subtitle'>
            Round Robin is a smart chore manager that assigns, rotates, and tracks
            household tasks so everyone does their fair share.
          </p>

          <h2 className='page-title'>How to get started</h2>
          <h3>Creating a new group</h3>
          <ol><li>Click Create.</li><li>An invite code will be generated for you.</li><li>Share the code with your group.</li></ol>
          <h3>Joining an existing group</h3>
          <ol><li>Enter the invite code.</li><li>Submit.</li></ol>
        </section>

        <section className='claim-column'>
          <form className='add-chore-form card' onSubmit={(event) => handleOpenAuthModal(event, groupActions.join)}>
            <h2>Join with an invite code</h2>
            <label>Invite code<input type='text' name='inviteCode' placeholder='e.g. 330 258' /></label>
            <button type='submit'>Join</button>
          </form>
          <form className='add-chore-form card' onSubmit={(event) => handleOpenAuthModal(event, groupActions.create)}>
            <h2>Create a new group</h2>
            <button type='submit'>Create</button>
          </form>
        </section>
      </div>

      <dialog ref={authDialogRef} className='card'>
        <button className='modal-close' type='button' aria-label='Close authentication modal' onClick={() => authDialogRef.current.close()}>×</button>
        {modalView === modes.signUp && signupForm}
        {modalView === modes.signIn && loginForm}
        {modalView === modes.groupName && groupNameForm}
      </dialog>
    </>
  )
}
