import './Post.css'
import { useState, useEffect } from 'react'
import { API_URL } from '../../constants'

const Post = ({ post }) => {
  const [imageUrl, setImageUrl] = useState('')
  const [comments, setComments] = useState([])

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

  return (
    <div className="post">
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
    </div>
  )
}

export default Post