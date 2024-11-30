import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import { getFriendList } from '../services/API';

export default function FriendList({ conversations, setConversations}) {

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Fetch friend list from API
    getFriendList(localStorage.getItem('userId'))
      .then(res => {
        setFriends(res.data.users);
      })
      .catch(err => {
        console.log(err);
      });
  }, [])

  const handleNewMessage = (receivedUserId) => {
    // Check if conversation already exists
    if(conversations.find(conversation => conversation.receivedUserId === receivedUserId)) return;

    // Add new message to the message container
    setConversations([...conversations, {
      sentUserId: localStorage.getItem('userId'),
      receivedUserId: receivedUserId,
      message: []
    }]);
  }

  return (
    <Container>
      <h4>Danh sách bạn bè</h4>
      {friends.map(friend => (
        <Container key={friend.id} className='d-flex border p-1 rounded-2 mb-3' style={{cursor: 'pointer'}} onClick={() => handleNewMessage(friend.id)}>
          <img src={friend.avatar} alt='avatar' style={{ width: '40px', borderRadius: '50%' }} />
          <h5 className='align-self-center ms-2'>{friend.firstName + " " + friend.lastName}</h5>
        </Container>
      ))}
    </Container>
  )
}
