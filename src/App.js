import './App.css'
import { useState, useEffect } from 'react'
import Post from './components/Post/Post'
import { API_URL } from './constants'
import { Button, Modal, Box, Input } from '@mui/material'
import ImageUpload from './components/ImageUpload/ImageUpload'

const INSTAGRAM_LOGO_URL = 'https://www.montclairbikebus.org/assets/images-www/new-instagram-text-logo.png'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

function App() {
  const [posts, setPosts] = useState([])
  const [password, setPassword] = useState('')
  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'))
  const [authTokenType, setAuthTokenType] = useState(() => localStorage.getItem('authTokenType'))
  const [username, setUsername] = useState(() => localStorage.getItem('username') ?? '')
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') ?? '')

  useEffect(() => {
    authToken ? localStorage.setItem('authToken', authToken) : localStorage.removeItem('authToken')
    authTokenType ? localStorage.setItem('authTokenType', authTokenType) : localStorage.removeItem('authTokenType')
    userId ? localStorage.setItem('userId', userId) : localStorage.removeItem('userId')
    username ? localStorage.setItem('username', username) : localStorage.removeItem('username')
  }, [authToken, authTokenType, userId, username])

  useEffect(() => {
    fetch(`${API_URL}/posts/`)
      .then(response => {
        const json = response.json()
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        const sorted = data.sort((a, b) => {
          // sort by timestamp in descending order
          const aTimestamp = new Date(a.timestamp).getTime()
          const bTimestamp = new Date(b.timestamp).getTime()
          return bTimestamp - aTimestamp
        })
        return sorted
      })
      .then(setPosts)
      .catch(error => console.error('Error fetching posts:', error))
  }, [])

  const handleSignUp = (event) => {
    event.preventDefault()

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    fetch(`${API_URL}/users/`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(() => {
        handleSignIn(event)
      })
      .catch(error => {
        console.error('Signup failed:', error)
      })

    setOpenSignUp(false)
  }

  const handleSignIn = (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const requestOptions = {
      method: 'POST',
      body: formData,
    }

    fetch(`${API_URL}/login`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        setAuthToken(data.access_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.error('Login failed:', error)
      })

    setOpenSignIn(false)
  }

  const handleSignOut = () => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId('')
    setUsername('')
  }

  return (
    <div className="app">
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <Box sx={modalStyle}>
          <form className="app-signin">
            <center>
              <img className="app-header-image" src={INSTAGRAM_LOGO_URL} alt="Instagram" />
            </center>
            <Input 
              placeholder="Username"
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input 
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button 
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSignIn}
            >
              Log In
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      >
        <Box sx={modalStyle}>
          <form className="app-signin">
            <center>
              <img className="app-header-image" src={INSTAGRAM_LOGO_URL} alt="Instagram" />
            </center>
            <Input 
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Input 
              placeholder="Username"
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input 
              placeholder="Password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button 
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>
      <div className="app-header">
        <img className="app-header-image" src={INSTAGRAM_LOGO_URL} alt="Instagram" />
        
        {authToken ? (
            <div className="app-header-auth">
              <Button variant="contained" color="primary" onClick={handleSignOut}>
                Log Out
              </Button>
            </div>
          ) : (
            <div className="app-header-auth">
              <Button 
                variant="contained"
                color="primary"
                onClick={() => setOpenSignIn(true)}
              >
                Log In
              </Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={() => setOpenSignUp(true)}
              >
                Sign Up
              </Button>
            </div>
          )
        }
      </div>
      <div className="posts">
        {posts.map(post => (
          <Post 
            key={post.id}
            post={post}
            authToken={authToken}
            authTokenType={authTokenType}
            username={username}
          />
        ))}
      </div>

      {authToken && (
        <ImageUpload
          authToken={authToken}
          authTokenType={authTokenType}
          userId={userId}
          username={username}
        />
      )}
      {/* TODO: What to show if logged out? */}
    </div>
  )
}

export default App
