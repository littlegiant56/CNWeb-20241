import React from 'react'
import { Container, Row, Col, Image, NavDropdown } from 'react-bootstrap'
import notification from '../assets/notification.png'
import messenger from '../assets/messenger.png'
import friends from '../assets/friends.png'
import user from '../assets/user.png'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import SearchBar from './SearchBar'
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Navbar() {

    return (
        <Container className='p-2 border-bottom sticky-top' fluid style={{ height: '10%', backgroundColor: '#fff' }}>
            <Row>
                <Col>
                    <Container className='p-0 d-flex'>
                        <Link className='me-2 mt-1' >
                            <Image src={logo} style={{ width: '40px' }} />
                        </Link>
                        {/* <Form>
                                <Form.Control className='rounded-pill' type="text" placeholder="Tìm kiếm" style={{ height: '50px' }} />
                            </Form> */}
                        <SearchBar />
                    </Container>
                </Col>
                <Col className='d-flex flex-row-reverse'>
                    <NavDropdown title={<Image src={user} className='border p-1 ms-4' roundedCircle />} id="basic-nav-dropdown">
                        <NavDropdown.Item >Đăng xuất</NavDropdown.Item>
                    </NavDropdown>
                    <Image style={{ cursor: 'pointer' }} className='border p-1 ms-4' src={notification} roundedCircle />
                    <Image style={{ cursor: 'pointer' }} className='border p-1 ms-4' src={messenger} roundedCircle />
                    <Link to={`/friendRequest`}>
                        <Image className='border p-1 ms-4' src={friends} roundedCircle />
                    </Link>
                </Col>
            </Row>
        </Container>
    )
}
