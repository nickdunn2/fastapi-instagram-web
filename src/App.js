import './App.css'
import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:8000'

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/posts/`)
      .then(response => {
        const json = response.json()
        console.log(json)
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error))
  }, [])

  return (
    <div className="app">
      <h1>Hello World</h1>
    </div>
  )
}

export default App
