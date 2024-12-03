import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { getProfileByUserId } from '../services/API';

export function ConversationTile({ conversation, conversations, setConversations, onConversationClick }) {

  const [userProfile, setUserProfile] = useState();
  const [friendId, setFriendId] = useState();

  const handleNewConversation = (receivedUserId) => {
    // Check if conversation already exists
    if (conversations.find(conversation => conversation.receivedUserId === receivedUserId)) return;

    // Add new message to the message container
    setConversations([...conversations, {
      sentUserId: localStorage.getItem('userId'),
      receivedUserId: receivedUserId,
      message: []
    }]);
  };

  useEffect(() => {
    let fId;
    if(conversation.id1 === localStorage.getItem('userId')) {
      fId = conversation.id2;
    } else {
      fId = conversation.id1;
    }
    setFriendId(fId);
    getProfileByUserId(fId)
      .then(res => {
        setUserProfile(res.data.user);
      })
      .catch(err => {
        console.log(err);
      });
  }, [conversation]);

  const handleClickConversation = () => {
    if (onConversationClick) {
      onConversationClick(); // Đóng danh sách cuộc trò chuyện khi người dùng nhấp vào cuộc trò chuyện
    }
    handleNewConversation(friendId); // Mở cuộc trò chuyện với người bạn
  };

  return (
    userProfile && <Container className='d-flex p-0' onClick={handleClickConversation}>
      <img src={userProfile?.avatar} alt={userProfile?.username} style={{ width: '60px', height: '47px', borderRadius: '50%', objectFit: 'cover' }} />
      <Container className='d-flex' >
        <Container className='p-0'>
          <h5 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '15px' }}>{userProfile.firstName + " " +  userProfile.lastName}</h5>
          <Container className='d-flex p-0' style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
            <p className='me-1'>{conversation.lastMessage.sentUserId === localStorage.getItem('userId') ? "You:" : ''}</p>
            <p>{conversation.lastMessage.content}</p>
          </Container>
        </Container>
        {!conversation.lastMessage.isRead && conversation.lastMessage.sentUserId !== localStorage.getItem('userId') && <Container className='bg-primary text-white rounded-2 p-1 align-self-center' style={{width: '10px', height: '10px'}}></Container>}
      </Container>
    </Container>
  );
}
