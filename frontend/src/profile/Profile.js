import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Button, Image, Tab, Tabs, NavLink } from 'react-bootstrap'
import NewFeeds from '../Home/NewFeeds'
import { Link, useParams } from 'react-router-dom'
import ProfileSideBar from '../components/ProfileSideBar';
import UpdateProfile from './UpdateProfile';
import { acceptFriendRequest, checkExistFriendRequest, createFriendRequest, declineFriendRequest, getPostByUserId, getProfileByUserId } from '../services/API'
import add_friend from '../assets/icons/add_friend.png'
import Post from '../posts/Post';
import { toast } from 'react-toastify';


export default function Profile() {

  const [profile, setProfile] = useState()
  const [userPosts, setUserPosts] = useState([])
  const [isFriend, setIsFriend] = useState(false)
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false)
  const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false)
  const { id } = useParams()

  const handleSendFriendRequest = () => {
    createFriendRequest({ userId: localStorage.getItem('userId'), friendId: id })
    setIsFriendRequestSent(true)
  }

  const handleRemoveFriendRequest = () => {
    declineFriendRequest({ userId: localStorage.getItem('userId'), friendId: id })
    setIsFriendRequestSent(false)
  }

  const handleDeclineFriendRequest = () => {
    declineFriendRequest({ friendId: localStorage.getItem('userId'), userId: id })
    setIsFriendRequestReceived(false)
  }

  const handleAcceptFriendRequest = () => {
    acceptFriendRequest({ friendId: localStorage.getItem('userId'), userId: id })
    setIsFriendRequestReceived(false)
    setIsFriend(true)
    toast.success("Add new friend successfully",{ autoClose: 3000 })
  }

  useEffect(() => {
    setUserPosts([])
    // const userId = localStorage.getItem('userId')
    // Fetch user profile from API
    getProfileByUserId(id)
      .then(res => {
        setProfile(res.data.user)
      })
      .catch(err => {
        console.log(err)
      })
    getPostByUserId(id)
      .then(res => {
        res.data.data.forEach(doc => {
          setUserPosts(prev => [...prev, {id: doc.id, ...doc.data}])
        })
      })
      .catch(err => {
        console.log(err)
      })
    // Kiểm tra xem có phải là bạn bè không
    getProfileByUserId(localStorage.getItem('userId'))
    .then(res => {
      setIsFriend(res.data.user.friendList.includes(id))
    })
    .catch(err => {
      console.log(err)
    })
    // Kiểm tra xem đã gửi lời mời kết bạn chưa
    checkExistFriendRequest(localStorage.getItem('userId'), id)
    .then(res => {
      setIsFriendRequestSent(res.data.status)
    })
    .catch(err => {
      console.log(err)
    })
    // Kiểm tra xem đã nhận được lời mời kết bạn chưa
    checkExistFriendRequest(id, localStorage.getItem('userId'))
    .then(res => {
      setIsFriendRequestReceived(res.data.status)
    })
    .catch(err => {
      console.log(err)
    })
  }, [id])


  return (
    profile && <Container className='p-0 row' fluid>
      <Container className='p-0' style={{ width: 1000, textAlign: 'center', position: 'relative' }} fluid>
        <Image
          className='rounded-bottom'
          src={profile.cover}
          style={{ width: 1000, height: 350, objectFit: 'cover' }}
          fluid
        />
        {id == localStorage.getItem('userId') ?
          <UpdateProfile /> :
          !isFriend && 
          (isFriendRequestReceived 
            ? <Container>
                <Button variant='success' style={{ position: 'absolute', bottom: 10, right: 20 }} onClick={handleAcceptFriendRequest}>
                  <Image src={add_friend} style={{ width: 20, marginRight: 10 }}></Image>
                  Accept friend request
                </Button>
                <Button className='btn-danger' style={{ position: 'absolute', bottom: 10, right: 230 }} onClick={handleDeclineFriendRequest}>
                  <Image src={add_friend} style={{ width: 20, marginRight: 10 }}></Image>
                  Refused to be friends
                </Button>
              </Container>
            : (!isFriendRequestSent 
              ? <Button variant='primary' style={{ position: 'absolute', bottom: 10, right: 20 }} onClick={handleSendFriendRequest}>
                  <Image src={add_friend} style={{ width: 20, marginRight: 10 }}></Image>
                  Make friend
                </Button> 
              : <Button className='btn-danger' style={{ position: 'absolute', bottom: 10, right: 20 }} onClick={handleRemoveFriendRequest}>
                  <Image src={add_friend} style={{ width: 20, marginRight: 10 }}></Image>
                  Cancel friend request
                </Button>
              )
          )
        }
      </Container>
      <Container className='d-flex mt-3' style={{ width: 1000, position: 'relative' }} fluid>
      <Image
          src={profile.avatar}
          style={{
            width: '200px',
            height: '200px',
            position: 'relative',
            top: '-100px',
            left: '30px',
            objectFit: 'cover',
            backgroundColor: 'white',
            borderRadius: '50% !important' ,
            border:'1px solid orange'  
          }}
        />
        <Container >
          <p className='ps-5' style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '35px' }}>{profile.firstName + " " + profile.lastName}</p>
          {/* <NavLink className='ps-5' as='a' to="/friends" >??? friends</NavLink> */}
        </Container>
      </Container>
      <Container style={{ width: 1000 }}>
        <Row>
          <Col className='m-0 w-50'>
            <ProfileSideBar userId={id} />
          </Col>
          <Col className='w-50'>
            {userPosts.length > 0 && userPosts.map((post, index) => (
              <Post key={index} post={post}/>
            ))}
          </Col>
        </Row>
      </Container>
    </Container>
  )
}