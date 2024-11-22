import React from 'react'
import { Container } from 'react-bootstrap'
import  CreatePost  from '../components/CreatePost';
import  DetailPost  from '../posts/DetailPost';
import  NavBar from '../components/Navbar';


export default function NewFeeds() {

    return(
      <div>
      <NavBar />
        <Container className='w-75'>
            <CreatePost />
            <DetailPost />
            
      </Container>
      </div>
    )
  }
  
  