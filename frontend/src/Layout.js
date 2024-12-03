import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Navbar from './components/Navbar'
import ProfileCard from './Home/ProfileCard'
import ConversationsContainer from './conversation/ConversationsContainer'
import ConversationList from './conversation/ConversationList'
import FriendList from './Home/FriendList'
import NotificationsContainer from './notification/NotificationsContainer'
import { socket } from './socket'

export default function Layout() {
  const [conversations, setConversations] = useState([]);
  const [doesNotificationContainerOpen, setDoesNotificationContainerOpen] = useState(false);
  const [doseMessageListOpen, setDoseMessageListOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    Notification.requestPermission();
    // Configure socket.io connection
    socket.io.opts.query = {
      userId: localStorage.getItem('userId')
    }
    socket.connect();
    socket.on('likePost', data => {
      const { sentUsername } = data
      new Notification(`${sentUsername} đã thích bài viết của bạn`)
    })
    socket.on('receiveMessage', data => {
      const { content, sentUsername } = data
      new Notification(`Bạn có tin nhắn mới từ ${sentUsername}`, {
        body: content
      })
    })
    socket.on('createComment', data => {
      const { sentUsername } = data
      new Notification(`${sentUsername} đã bình luận bài viết của bạn`)
    })
    return () => {
      socket.off('likePost')
      socket.off('receiveMessage')
      socket.off('createComment')
    }
  }, [socket])

  const isProfileOrFriendRequestPage = location.pathname.startsWith('/profile') || location.pathname === '/friendRequest';
  return (
    <Container fluid className='p-0 position-relative'style={{backgroundColor:'#f1b472'}}>
        <Navbar
        doesNotificationContainerOpen={doesNotificationContainerOpen} 
        setDoesNotificationContainerOpen={setDoesNotificationContainerOpen} 
        doseMessageListOpen={doseMessageListOpen}
        setDoseMessageListOpen={setDoseMessageListOpen}
      />
        <Container className='p-0 pt-2 position-relative mt-3' fluid>
        {!isProfileOrFriendRequestPage && (
          <Container className='p-0 position-fixed mt-4' style={{ width: '20%', top: '75px', left: '0px' }}>
            <ProfileCard />
          </Container>
        )}
            <Container className='p-0' style={{ width: '60%' }}>
                <Outlet />
            </Container>
            {!isProfileOrFriendRequestPage && (
          <Container className='p-0 position-fixed mt-4' style={{ width: '20%', top: '75px', right: '0px' }}>
            <FriendList conversations={conversations} setConversations={setConversations} />
          </Container>
        )}
        </Container>
        {doesNotificationContainerOpen && <NotificationsContainer />}
        {doseMessageListOpen && <ConversationList conversations={conversations} setConversations={setConversations}/>}
        <ConversationsContainer conversations={conversations} setConversations={setConversations}/>
    </Container>
  )
}
