import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { getAllConversationByUserId } from '../services/API'
import { ConversationTile } from './ConversationTile'

export default function ConversationList({ conversations, setConversations }) {

  const [conversationsList, setConversationsList] = useState([])

  useEffect(() => {
    getAllConversationByUserId(localStorage.getItem('userId'))
      .then(res => {
        setConversationsList(res.data.conversations)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <Container className='border rounded z-1 p-2' style={{position: "fixed", top: '70px', right: '10px', width: '300px', backgroundColor: '#fff'}}>
			<h3>Tin nhắn</h3>
      {conversationsList.map((conversation, index) => (
        <ConversationTile key={index} conversation={conversation} conversations={conversations} setConversations={setConversations}/>
      ))}
    </Container>
  )
}
