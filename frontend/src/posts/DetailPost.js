import React from 'react'
import { Container } from 'react-bootstrap'
import heart from '../assets/heart.png';
import comment from '../assets/comment.png';
import share from '../assets/share.png';
import user from '../assets/user.png';
import { Link } from 'react-router-dom'
import { Card, Col, Image } from 'react-bootstrap'


export default function DetailPost() {
    return (
      
        <Card className='mb-2'>
          <Card.Header >
            <Container className='d-flex justify-content-between p-0'>
              <Col className='d-flex'>
                <img src={user} alt='avatar' style={{width: '40px', borderRadius: '50%' }} />
                <Link style={{textDecoration: 'none', color: 'black'}}>
                  <h5 className='align-self-center ms-2'>sdfa</h5>
                </Link>
              </Col>
              <Col className='d-flex flex-row-reverse'>
                <p className='align-self-center m-0'>Tạo lúc: datatime</p>
              </Col>
            </Container>
          </Card.Header>
          <Card.Body >
            <Card.Text>
              Noi dung bai post
            </Card.Text>
            
          </Card.Body>
          <Card.Footer >
            <Container className='d-flex justify-content-between'>
              <Col className='d-flex'>
                <Image className='me-2' src={ heart} />
                <p className='align-self-center m-0'>0 lượt thích</p>
              </Col>
              <Col className='d-flex'>
                <Image className='me-2' src={comment} />
                <p className='align-self-center m-0'>0 bình luận</p>
              </Col>
              <Col className='d-flex'>
                <Image className='me-2' style={{cursor: 'pointer'}} src={share} />
                <p className='align-self-center m-0'>Chia sẻ</p>
              </Col>
            </Container>
            
          </Card.Footer>
        </Card>
      )
    }

