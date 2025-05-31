import './App.css'
import { useState, useEffect } from 'react'
import Post from './components/Post/Post'
import { API_URL } from './constants'

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
      <div className="posts">
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default App
