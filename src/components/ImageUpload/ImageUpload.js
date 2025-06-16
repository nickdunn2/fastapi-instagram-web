import './ImageUpload.css'
import { useState } from 'react'
import { Button } from '@mui/material'
import { API_URL } from '../../constants'

const ImageUpload = ({
  authToken,
  authTokenType,
  userId,
}) => {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleImageUpload = (e) => {
    e.preventDefault()

    console.log(caption, image)

    const formData = new FormData()
    formData.append('image', image)

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': `${authTokenType} ${authToken}`,
      }),
      body: formData,
    }

    fetch(`${API_URL}/posts/image-upload`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        createPost(data.filename)
      })
      .catch(error => {
        console.error('Image upload failed:', error)
      })
      .finally(() => {
        setCaption('')
        setImage(null)
        document.getElementById('file-input').value = null
      })
  }

  const createPost = (imageUrl) => {
    console.log(imageUrl)

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Authorization': `${authTokenType} ${authToken}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        image_url: imageUrl,
        image_url_type: 'relative',
        caption,
        creator_id: userId,
      }),
    }

    fetch(`${API_URL}/posts/`, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(() => {
        window.location.reload()
        window.scrollTo(0, 0)
      })
      .catch(error => {
        console.error('Post creation failed:', error)
      })
  }


  return (
    <div className="image-upload">
      <input 
        type="text"
        placeholder="Enter a caption..."
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input
        id="file-input"
        type="file"
        // accept="image/*"
        onChange={handleImageChange}
      />
      <Button 
        className="image-upload-button"
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleImageUpload}
      >
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload