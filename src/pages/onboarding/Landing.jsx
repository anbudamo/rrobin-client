import robinImage from '../../assets/robin.webp'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

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

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Landing({ onUserJoin, onUserCreate }) {
  // Ref to the react modal
  const authDialogRef = useRef(null)

  // Tracks the current form in the modal
  const [modalView, setModalView] = useState(modes.signUp)

  // Remembers whether the user chose Join or Create
  const [selectedGroupAction, setSelectedGroupAction] = useState(null)
  const [authError, setAuthError] = useState('')

  // Validates sign-up fields and stores field-specific sign-up errors
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    getValues: getSignupValues,
    formState: { errors: signupErrors },
  } = useForm()

  // Validates sign-in fields and stores field-specific sign-in errors
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm()

  // Saves the selected path (join or create), then opens the auth modal
  const handleOpenAuthModal = (event, groupAction) => {
    event.preventDefault()
    setSelectedGroupAction(groupAction)
    setModalView(modes.signUp)
    setAuthError('')
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

  const handleAuthenticationSubmit = async (credentials, endpoint) => {
    setAuthError('')

    try {
      // TODO- setup auth in backend
      // const response = await fetch(`${apiUrl}/api/auth/${endpoint}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // })
      // const result = await response.json()

      // if (!response.ok) {
      //   setAuthError(result.error || 'Unable to authenticate. Please try again.')
      //   return
      // }

      // // This is suitable for the development milestone. Prefer secure httpOnly
      // // cookies with refresh tokens before a production deployment.
      // localStorage.setItem('roundrobin-access-token', result.accessToken)
      // localStorage.setItem('roundrobin-user', JSON.stringify(result.user))
      handleGroupAction()
    } catch {
      setAuthError('Unable to reach the server. Please try again.')
    }
  }

  /* Form html and validation */
  const signupForm = (
    <form
      className='add-chore-form'
      onSubmit={handleSignupSubmit((values) => handleAuthenticationSubmit({
        username: values.username,
        email: values.email,
        password: values.password,
      }, 'signup'))}
    >
      <h2>Create an account</h2>
      <label>
        Username
        <input
          type='text'
          {...registerSignup('username', { required: 'Username is required' })}
          aria-invalid={Boolean(signupErrors.username)}
        />
        {signupErrors.username && <p className='form-error'>{signupErrors.username.message}</p>}
      </label>
      <label>
        Email address
        <input
          type='email'
          {...registerSignup('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
          aria-invalid={Boolean(signupErrors.email)}
        />
        {signupErrors.email && <p className='form-error'>{signupErrors.email.message}</p>}
      </label>
      <label>
        Password
        <input
          type='password'
          {...registerSignup('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
          aria-invalid={Boolean(signupErrors.password)}
        />
        {signupErrors.password && <p className='form-error'>{signupErrors.password.message}</p>}
      </label>
      <label>
        Confirm password
        <input
          type='password'
          {...registerSignup('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === getSignupValues('password') || 'Passwords do not match',
          })}
          aria-invalid={Boolean(signupErrors.confirmPassword)}
        />
        {signupErrors.confirmPassword && <p className='form-error'>{signupErrors.confirmPassword.message}</p>}
      </label>
      <button type='submit'>Create account</button>
      {authError && <p className='form-error' role='alert'>{authError}</p>}
      <p>
        Already have an account?{' '}
        <button type='button' onClick={() => setModalView(modes.signIn)}>Sign in</button>
      </p>
    </form>
  )

  const loginForm = (
    <form
      className='add-chore-form'
      onSubmit={handleLoginSubmit((values) => handleAuthenticationSubmit({
        login: values.login,
        password: values.loginPassword,
      }, 'signin'))}
    >
      <h2>Sign in</h2>
      <label>
        Username or email address
        <input
          type='text'
          {...registerLogin('login', { required: 'Username or email is required' })}
          aria-invalid={Boolean(loginErrors.login)}
        />
        {loginErrors.login && <p className='form-error'>{loginErrors.login.message}</p>}
      </label>
      <label>
        Password
        <input
          type='password'
          {...registerLogin('loginPassword', { required: 'Password is required' })}
          aria-invalid={Boolean(loginErrors.loginPassword)}
        />
        {loginErrors.loginPassword && <p className='form-error'>{loginErrors.loginPassword.message}</p>}
      </label>
      <button type='submit'>Sign in</button>
      {authError && <p className='form-error' role='alert'>{authError}</p>}
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
