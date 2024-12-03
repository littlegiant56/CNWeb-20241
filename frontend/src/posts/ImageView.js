import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Button } from 'react-bootstrap'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPostById, getProfileByUserId, removeLikePost } from '../services/API';
import { socket } from '../socket'
import CommentSection from '../components/CommentSection'
// import heart from '../assets/icons/heart.png'
// import comment from '../assets/icons/comment.png'
// import share from '../assets/icons/share.png'
// import prevArrow from '../assets/icons/prev-arrow.png'
// import nextArrow from '../assets/icons/next-arrow.png'
// import heart_red from '../assets/icons/heart_red.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons'
import backIcon from '../assets/icons/back_icon.png'
// imageView
export default function ImageView() {

  const [post, setPost] = useState();
  const [userInfo, setUserInfo] = useState();
  const { postId } = useParams();
  let location = useLocation();
  const [imagePosition, setImagePosition] = useState();
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handlePreviousImage = () => {
    setImagePosition(Math.max(0, Number(imagePosition) - 1));
  }

  const handleNextImage = () => {
    setImagePosition(Math.min(post.image.length - 1, Number(imagePosition) + 1));
  }

  const handleClickLike = () => {
    setIsLiked(isLiked => !isLiked);
    if (isLiked) {
      removeLikePost(localStorage.getItem('userId'), postId);
      setLikeCount(likeCount => likeCount - 1);
    } else {
      socket.emit("likePost", {
        sentUsername: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        postId: postId,
        postUserId: post.userId
      })
      setLikeCount(likeCount => likeCount + 1);
    }
  }

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      navigate(-1);
    }
  }

  useEffect(() => {
    setImagePosition(location.state.imagePosition);
    getPostById(postId)
      .then(res => {
        setPost(res.data.data)
        setIsLiked(res.data.data.likedList.includes(localStorage.getItem('userId')))
        setCommentCount(res.data.data.comments.length)
        setLikeCount(res.data.data.likedList.length)
        getProfileByUserId(res.data.data.userId)
          .then(res => {
            setUserInfo(res.data.user)
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    }
  }, [postId])

  return (
    post &&
    <Container fluid className='p-0 m-0 position-relative' style={{height: '100vh'}}>
      <Container className='bg-dark d-flex justify-content-between p-0 position-fixed' style={{width: '70%', height:'100%'}}>
        <Button className='bg-dark text-white border-0 text-decoration-none' style={{position: 'absolute', top: '10px', width: '10px', left: '10px'}} onClick={() => navigate(-1)}>
          X
        </Button>
        <Button className='p-0 border-0 align-self-center ms-3' style={{width: '30px', background: 'transparent'}} onClick={handlePreviousImage}>
          <Image style={{width: '30px'}} src={backIcon} />
        </Button>
        <Image className='object-fit-scale' src={post.image[imagePosition]} style={{maxHeight: '100vh', maxWidth: '90%'}}/>
        <Button className='p-0 border-0 align-self-center me-2' style={{width: '30px', background: 'transparent'}} onClick={handleNextImage}>
          <Image style={{width: '30px', transform: 'rotate(180deg)'}} src={backIcon} />
        </Button>
      </Container>
      <Container className='p-2 position-absolute top-0 end-0' style={{width: '30%'}}>
        <Container className='mb-2'>
          { userInfo &&
            <Container className='d-flex p-0 mb-2'>
              <Image className='me-2' style={{width: '50px'}} src={userInfo.avatar} roundedCircle />
              <h3>{userInfo.firstName} {userInfo.lastName}</h3>
            </Container>
          }
          <Container className='p-0'>
            {post.body}
          </Container>
          {post.dateCreated && 
            <p className='text-secondary'>{new Date(post.dateCreated.seconds * 1000).toLocaleString()}</p>
          }
          <Container className='d-flex justify-content-between align-items-center p-0'>
            <Col className='d-flex align-items-center '>
              <FontAwesomeIcon 
                icon={faThumbsUp} 
                className='me-2' 
                onClick={handleClickLike} 
                style={{cursor: 'pointer', color: isLiked ? 'blue' : 'black'}} 
              />
              <p className='m-0'>{likeCount} Like</p>
            </Col>
            <Col className='d-flex align-items-center justify-content-center' >
              <FontAwesomeIcon icon={faComment} className='me-2' />
              <p className=' m-0'>{commentCount} Comment</p>
            </Col>
            <Col className='d-flex align-items-center justify-content-end'>
              <FontAwesomeIcon icon={faShare} className='me-2' />
              <p className=' m-0'>Share</p>
            </Col>
          </Container>
        </Container>
        <CommentSection postId={postId} postUserId={post.userId}/>
      </Container>
    </Container>
  )
}
