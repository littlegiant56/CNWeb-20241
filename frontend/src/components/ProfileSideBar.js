import React, { useEffect, useState } from 'react'
import { Container, Image } from 'react-bootstrap'
import user from '../assets/icons/user.png'
import { Link } from 'react-router-dom'
import { getProfileByUserId } from '../services/API'

function ProfileSideBar({userId}) {

  const [profile, setProfile] = useState();

  useEffect(() => {
    // const userId = localStorage.getItem('userId')
    // Fetch user profile from API
    getProfileByUserId(userId)
      .then(res => {
        setProfile(res.data.user)
      })
      .catch(err => {
        console.log(err)
      })
  }, [userId])

  return (
    profile && <Container className='p-3 m-0 border rounded shadow-sm' style={{ width: "100%" }}>
      <h4>Mô tả bản thân</h4>
      {profile.description && <p><span className='fw-semibold'>Giới thiệu: </span>{profile.description}</p>}

      {profile.address && <p><span className='fw-semibold'>Nơi ở: </span>{profile.address}</p>}

      {profile.DOB && <p><span className='fw-semibold'>Ngày sinh: </span>{profile.DOB}</p>}

      {profile.school && <p><span className='fw-semibold'>Học tại: </span>{profile.school}</p>}

      {profile.work && <p><span className='fw-semibold'>Làm việc tại: </span>{profile.work}</p>}

      {/* <Image className='border' src={profile.avatar} style={{width: '80px'}} roundedCircle />
        <h5 className='align-self-center m-0 ms-2'>{profile.firstName + " " + profile.lastName}</h5> */}

    </Container>
  )
}

export default ProfileSideBar