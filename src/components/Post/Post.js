import './Post.css'
import { useState, useEffect } from 'react'
import { API_URL } from '../../constants'

const Post = ({ post }) => {
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (post.image_url_type === 'absolute') {
      setImageUrl(post.image_url)
    } else {
      setImageUrl(`${API_URL}/${post.image_url}`)
    }
  }, [post.image_url, post.image_url_type])

  return (
    <div className="post">
      <img className="post-image" src={imageUrl} alt={post.title} />
    </div>
  )
}

export default Post