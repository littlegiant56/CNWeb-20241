import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Image } from 'react-bootstrap'
import { getProfileByUserId, getPostById } from '../services/API'
import { Link } from 'react-router-dom'

export default function SharedPostCard({ postId }) {

  const [sharedPost, setSharedPost] = useState()
  const [userProfile, setUserProfile] = useState()

  useEffect(() => {
    getPostById(postId)
      .then(res => {
        setSharedPost(res.data.data)
        return res.data.data
      })
      .then((sharedPost) => {
        getProfileByUserId(sharedPost.userId)
          .then(res => {
            setUserProfile(res.data.user)
          })
          .catch(err => {
            console.log(err)
          })
      })

  }, [postId])

  return (
    <Link to={`/post/${postId}`} className='text-decoration-none text-dark'>
      <Card>
        <Card.Header style={{backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderBottom: 'none' }}>
          <Image className='me-2' src={userProfile?.avatar} roundedCircle style={{ width: '30px', height: '30px',border: '1px solid #aaa' }} />
          <span className='ml-2'>{userProfile?.firstName} {userProfile?.lastName}</span>
        </Card.Header>
        <Card.Body style={{backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderBottom: 'none' }}>
          <Card.Text>
            {sharedPost?.body}
          </Card.Text>
          <Container className='d-flex justify-content-start mb-2 p-0' style={{ overflowX: 'auto' }}>
            {sharedPost?.image && sharedPost.image.map((image, index) => (
              <Image key={index} src={image} style={{ maxWidth: '300px' }} className='me-3 border' />
            ))}
          </Container>
          {sharedPost?.video && <video className='border' src={sharedPost.video} controls width="100%" />}
        </Card.Body>
      </Card>
    </Link>
  )
}
