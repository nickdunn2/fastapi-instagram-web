import './Post.css'
import { useState, useEffect } from 'react'
import { API_URL } from '../../constants'
import { Avatar, Button } from '@mui/material'

const Post = ({ post, authToken, authTokenType, username }) => {
  const [imageUrl, setImageUrl] = useState('')
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (post.image_url_type === 'absolute') {
      setImageUrl(post.image_url)
    } else {
      setImageUrl(`${API_URL}/${post.image_url}`)
    }
  }, [post.image_url, post.image_url_type])

  useEffect(() => {
    setComments(post.comments)
  }, [post.comments])

  const handleDeletePost = (event) => {
    event.preventDefault()

    const requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `${authTokenType} ${authToken}`,
      }),
    }

    fetch(`${API_URL}/posts/${post.id}`, requestOptions)
      .then(response => {
        if (response.ok) {
          window.location.reload()
        }
        throw response
      })
      .catch(error => {
        console.error('Post deletion failed:', error)
      })
  }

  const fetchComments = () => {
    fetch(`${API_URL}/comments/${post.id}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(setComments)
      .catch(error => console.error(`Failed to fetch comments for post ${post.id}:`, error))
  }

  const postComment = (event) => {
    event.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': `${authTokenType} ${authToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        post_id: post.id,
        text: newComment,
        username: username,
      }),
    }

    fetch(`${API_URL}/comments`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(() => {
        fetchComments()
      })
      .catch(error => {
        console.error('Failed to post comment:', error)
      })
      .finally(() => {
        setNewComment('')
      })
  }

  return (
    <div className="post">
      <div className="post-header">
        <Avatar src="" alt={post.user.username} />
        <div className="post-header-info">
          <h3>{post.user.username}</h3>
          {authToken && username === post.user.username && (
            <Button 
            variant="contained"
            color="error"
            onClick={handleDeletePost}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <img className="post-image" src={imageUrl} alt={post.title} />
      <p className="post-caption">{post.caption}</p>
      <div className="post-comments">
        {comments.map(comment => (
          <div className="post-comment" key={comment.id}>
            <p>
              <strong>{comment.username}:</strong> {comment.text}
            </p>
          </div>
        ))}
      </div>

      {authToken && (
        <form className="post-comment-form">
          <input
            type="text"
            className="post-comment-input"
            placeholder="Add a comment"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <Button 
            type="submit"
            className="post-comment-button"
            variant="contained"
            color="primary"
            disabled={!newComment.trim()}
            onClick={postComment}
          >
            Post
          </Button>
        </form>
      )}
    </div>
  )
}

export default Post