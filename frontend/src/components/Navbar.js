import React from 'react'
import { Container, Row, Col, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faBell, faPlay,faPlusSquare,faHeart, faUserFriends, faUser ,faHome,faCommentDots} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/icons/logo.png'
import { socket } from '../socket'
import SearchBar from './SearchBar'

/**
 * Represents the navigation bar component.
 * @returns {JSX.Element} The JSX element representing the navigation bar.
 */
export default function NavBar({ doesNotificationContainerOpen, setDoesNotificationContainerOpen, doseMessageListOpen, setDoseMessageListOpen }) {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('userId');
    // Disconnect socket.io connection
    socket.disconnect();
    navigate('/login');
  }

  return (
    <Container className='p-2 border-bottom sticky-top' fluid style={{ backgroundColor: '#fff' }}>
      <Row className='align-items-center'>
        <Col className='col-3  d-flex align-items-center'>
          <Link className='me-2' to={'/'}>
            <img src={logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
          </Link>
          <SearchBar />
        </Col>
        <Col className='col-6'>
          <Link to={`/`}>
          <FontAwesomeIcon icon={faHome}  style={{ fontSize: '25px' ,marginLeft:'102px',cursor:'pointer' }} />
          </Link>
          <Link to={`/friendRequest`}>
            <FontAwesomeIcon icon={faUserFriends}  style={{ fontSize: '25px',marginLeft:'85px', color:'black',cursor:'pointer' }} />
          </Link>
          <FontAwesomeIcon icon={faPlay}  style={{ fontSize: '25px',marginLeft:'85px' ,cursor:'pointer'}} />
          <FontAwesomeIcon icon={faPlusSquare}  style={{ fontSize: '25px',marginLeft:'85px',cursor:'pointer' }} />
          <FontAwesomeIcon icon={faHeart}  style={{ fontSize: '25px',marginLeft:'85px',cursor:'pointer' }} />
        </Col>
        <Col className='col-3 d-flex justify-content-end'>
          
          <FontAwesomeIcon icon={faEnvelope}  style={{ fontSize: '25px', cursor: 'pointer', }} 
            onClick={() => {
                setDoseMessageListOpen(!doseMessageListOpen)
                setDoesNotificationContainerOpen(false)
            }}
          />
          <FontAwesomeIcon icon={faBell} style={{ fontSize: '25px', cursor: 'pointer',marginLeft:'25px' }} 
            onClick={() => {
                setDoesNotificationContainerOpen(!doesNotificationContainerOpen)
                setDoseMessageListOpen(false)
            }}
          />
          
          <NavDropdown title={<FontAwesomeIcon icon={faUser} style={{ fontSize: '25px' ,margin:'0 25px'}} />} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
          </NavDropdown>
        </Col>
      </Row>
    </Container>
  )
}
