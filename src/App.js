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
