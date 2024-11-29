import React, { useEffect, useState } from 'react'
import { Container, Image } from 'react-bootstrap'
import user from '../assets/icons/user.png'
import { Link } from 'react-router-dom'
import { getProfileByUserId } from '../services/API'

export default function ProfileCard() {

  const [profile, setProfile] = useState();

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    // Fetch user profile from API
    getProfileByUserId(userId)
      .then(res => {
        setProfile(res.data.user)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    profile && <Container>
      <Link className='d-flex border p-1 rounded-2' to={`/profile/${localStorage.getItem('userId')}`} style={{ textDecoration: 'none', color: 'black' }}>
        <Image className='border ' src={profile.avatar} style={{width: '80px', height: '80px', objectFit: 'cover'}} roundedCircle />
        <h5 className='align-self-center m-0 ms-2'>{profile.firstName + " " + profile.lastName}</h5>
      </Link>
    </Container>
  )
}
