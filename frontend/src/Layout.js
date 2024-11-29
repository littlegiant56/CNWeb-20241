import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Navbar from './components/Navbar'
import ProfileCard from './Home/ProfileCard'
import ConversationsContainer from './conversation/ConversationsContainer'
import ConversationList from './conversation/ConversationList'
import NotificationsContainer from './notification/NotificationsContainer'
import { socket } from './socket'

export default function Layout() {
  const [conversations, setConversations] = useState([]);
  const [doesNotificationContainerOpen, setDoesNotificationContainerOpen] = useState(false);
  const [doseMessageListOpen, setDoseMessageListOpen] = useState(false);

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
  return (
    <Container fluid className='p-0 position-relative'>
        <Navbar
        doesNotificationContainerOpen={doesNotificationContainerOpen} 
        setDoesNotificationContainerOpen={setDoesNotificationContainerOpen} 
        doseMessageListOpen={doseMessageListOpen}
        setDoseMessageListOpen={setDoseMessageListOpen}
      />
        <Container className='p-0 pt-2 position-relative' fluid>
            <Container className='p-0 position-fixed' style={{ width: '20%', top: '75px', left: '0px' }}>
               <ProfileCard />
            </Container>
            <Container className='p-0' style={{ width: '60%' }}>
                <Outlet />
            </Container>
        </Container>
        {doesNotificationContainerOpen && <NotificationsContainer />}
        {doseMessageListOpen && <ConversationList conversations={conversations} setConversations={setConversations}/>}
        <ConversationsContainer conversations={conversations} setConversations={setConversations}/>
    </Container>
  )
}
