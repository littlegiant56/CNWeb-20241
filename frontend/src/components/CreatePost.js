import React from 'react'
import { Container } from 'react-bootstrap'
import { Form, Button, Image } from 'react-bootstrap';
import image from '../assets/image.png';
import video from '../assets/video.png';


export default function CreatePost() {

    return(  
         <Form className='mb-4 border' >
          <textarea className="form-control mb-2" placeholder="Bạn đang nghĩ gì" style={{ height: "100px", border: 0 }} />
          
          <Container className='p-2 d-flex justify-content-between'>
            <Container className='d-flex'>
              <div className='me-3'>
                <label htmlFor='image-upload' style={{ cursor: 'pointer' }}>
                  <Image src={image} />
                </label>
                
              </div>
              <div>
                <label htmlFor='video-upload' style={{ cursor: 'pointer' }}>
                  <Image src={video} />
                </label>
                
              </div>
            </Container>
            <Button type='submit'>Đăng</Button>
          </Container>
        </Form>
    )
}
