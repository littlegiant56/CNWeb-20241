import React, { useState, useEffect, useRef } from 'react'
import { Button, Container, Image } from 'react-bootstrap'
import { getConversationMessages, getMessagesConversationByOffset, getProfileByUserId, markConversationAsRead } from '../services/API'
import { socket } from '../socket';
import send from '../assets/icons/send.png';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function ConversationPanel({ conversation, conversations, setConversations }) {

  const [receivedUserProfile, setReceivedUserProfile] = useState();
  const [listMessages, setListMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const handleCloseMessage = () => {
    setConversations(conversations.filter(msg => msg.receivedUserId !== conversation.receivedUserId));
  }

  const handleGetMoreMessages = () => {
    getMessagesConversationByOffset(localStorage.getItem('userId'), conversation.receivedUserId, listMessages.length, 10)
      .then(res => {
        setListMessages([...listMessages, ...res.data.messages]);
        setHasMore(res.data.hasMore);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Send message to server
  const handleSendMessage = () => {
    if(message.length == 0) return;
    const newMessage = {
      sentUsername: localStorage.getItem('username'),
      sentUserId: localStorage.getItem('userId'),
      receivedUserId: conversation.receivedUserId,
      content: message
    }
    socket.emit('sendMessage', newMessage);
    setListMessages([newMessage, ...listMessages]);
    setMessage("");
  }

  const handleMarkConversationAsRead = () => {
    markConversationAsRead({
      userId: localStorage.getItem('userId'),
      friendId: conversation.receivedUserId
    })
  }

  socket.on('receiveMessage', message => {
    if(message.sentUserId === conversation.receivedUserId) {
      setListMessages([message, ...listMessages]);
    }
  })

  useEffect(() => {
    // Fetch user profile from API
    getProfileByUserId(conversation.receivedUserId)
      .then(res => {
        setReceivedUserProfile(res.data.user);
      })
      .catch(err => {
        console.log(err);
      });
    getMessagesConversationByOffset(localStorage.getItem('userId'), conversation.receivedUserId, 0, 10)
      .then(res => {
        setListMessages(res.data.messages);
        setHasMore(res.data.hasMore)
      })
      .catch(err => {
        console.log(err);
      });
  }, [conversation])
  

  return (
    receivedUserProfile && <Container className='border p-1 rounded-2 m-0 mb-3 bg-white' style={{width: '300px'}}>
      <Container className='d-flex p-0'>
        <img src={receivedUserProfile?.avatar} alt='avatar' style={{ width: '40px', borderRadius: '50%' }} />
        <h5 className='align-self-center ms-2'>{receivedUserProfile?.firstName + " " + receivedUserProfile?.lastName}</h5>
        <Button variant='danger' className='ms-auto' onClick={handleCloseMessage}>X</Button>
      </Container>
      <Container id="message-panel" className='border rounded-2 p-1 mb-2' style={{height: '300px', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse'}}>
        <InfiniteScroll
          dataLength={listMessages.length}
          next={handleGetMoreMessages}
          style={{ display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden' }}
          inverse={true}
          hasMore={hasMore}
          loader={<h5>Loading...</h5>}
          scrollableTarget='message-panel'
        >
          {listMessages.map((msg, index) => {
            return (
              <Container key={index} style={{width: '120px'}} className={msg.sentUserId === localStorage.getItem('userId') ? 'bg-primary text-white rounded-2 p-1 mb-1 m-0 align-self-end' : 'bg-secondary text-white rounded-2 p-1 mb-1 align-self-start m-0'}>
                {msg.content}
              </Container>
            )})
          }
        </InfiniteScroll>
      </Container>
      <Container className='p-0 d-flex'>
        <input value={message} onChange={e => setMessage(e.target.value)} type='text' className='form-control me-2' onKeyDown={e => {
          if(e.key === 'Enter') handleSendMessage();
        }} onFocus={handleMarkConversationAsRead}/>
        <Image style={{height: '30px', cursor: 'pointer'}} src={send} onClick={handleSendMessage}/>
      </Container>
    </Container>
  )
}
