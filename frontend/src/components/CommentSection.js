import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { getCommentByPostId, getPostById } from '../services/API'
import Post from '../posts/Post'
import { socket } from '../socket'

export default function CommentSection({ postUserId, postId }) {

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  function getAllComments() {
    setComments([])
    getCommentByPostId(postId)
      .then(res => {
        res.data.data.forEach(doc => {
          setComments(prev => [...prev, { post: { ...doc, id: doc.postId } }])
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getAllComments()
  }, [postId])

  useEffect(() => {
    comments.sort((a, b) => {
      return new Date(b.post.dateCreated.seconds * 1000 + b.post.dateCreated.nanoseconds / 1000000) - new Date(a.post.dateCreated.seconds * 1000 + a.post.dateCreated.nanoseconds / 1000000)
    })
  }, [comments])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('createComment', {
      sentUsername: localStorage.getItem('username'),
      userId: localStorage.getItem('userId'),
      postId: postId,
      postUserId: postUserId,
      content: newComment
    })
    setNewComment('')
  }

  return (
    <Container className='p-0'>
      <Form className='d-flex mb-2' onSubmit={handleSubmit}>
        <Form.Group className='me-2' style={{ width: '100%' }}>
          <Form.Control type='text' placeholder='Viết comment...' value={newComment} onChange={e => setNewComment(e.target.value)} />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Gửi
        </Button>
      </Form>
      <Container className='p-0'>
        {comments.map((comment, index) => (
          <Post key={index} post={comment.post} />
        ))}
      </Container>
    </Container>
  )
}
