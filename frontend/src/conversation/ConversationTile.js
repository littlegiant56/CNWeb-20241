import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { getProfileByUserId } from '../services/API';

export function ConversationTile({ conversation, conversations, setConversations }) {

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

  return (
    userProfile && <Container className='d-flex p-0' onClick={() => handleNewConversation(friendId)}>
      <img src={userProfile?.avatar} alt={userProfile?.username} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
      <Container className='d-flex'>
        <Container className='p-0'>
          <h5>{userProfile.firstName + " " +  userProfile.lastName}</h5>
          <Container className='d-flex p-0'>
            <p className='me-1'>{conversation.lastMessage.sentUserId == localStorage.getItem('userId') ? "Bạn:" : `${conversation.lastMessage.sentUsername}:`}</p>
            <p>{conversation.lastMessage.content}</p>
          </Container>
        </Container>
        {!conversation.lastMessage.isRead && conversation.lastMessage.sentUserId != localStorage.getItem('userId') && <Container className='bg-primary text-white rounded-2 p-1 align-self-center' style={{width: '10px', height: '10px'}}></Container>}
      </Container>
    </Container>
  );
}
