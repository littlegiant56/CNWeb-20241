import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Image } from 'react-bootstrap'
// 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons'
import { getProfileByUserId, removeLikePost, sharePost, getPostById } from '../services/API'
import { Link } from 'react-router-dom'
import { socket } from '../socket'
import { toast } from 'react-toastify'
import SharedPostCard from '../components/SharedPostCard'
import SharePostModal from '../components/SharePostModal'

export default function Post({ post }) {

  const [name, setName] = useState("");
  const [avatarImgLink, setAvatarImgLink] = useState();
  const [dateCreated, setDateCreated] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [openShare, setOpenShare] = useState(false);

  useEffect(() => {
    getProfileByUserId(post.userId)
      .then(res => {
        setName(res.data.user.firstName + " " + res.data.user.lastName);
        setAvatarImgLink(res.data.user.avatar);
      })
    const fireBaseTime = new Date(
      post.dateCreated.seconds * 1000 + post.dateCreated.nanoseconds / 1000000,
    );
    setIsLiked(post.likedList.includes(localStorage.getItem('userId')));
    setLikeCount(post.likedList.length);
    setCommentCount(post.comments.length);
    setDateCreated(fireBaseTime.toLocaleTimeString('vi-VN') + " " + fireBaseTime.toLocaleDateString('vi-VN'))
  }, [post])

  const handleClickLike = () => {
    setIsLiked(isLiked => !isLiked);
    if (isLiked) {
      removeLikePost(localStorage.getItem('userId'), post.id);
      setLikeCount(likeCount => likeCount - 1);
    } else {
      socket.emit("likePost", {
        sentUsername: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        postId: post.id,
        postUserId: post.userId
      })
      setLikeCount(likeCount => likeCount + 1);
    }
  }

  const handleSharePost = () => {
    setOpenShare(true)
  }

  return (
    <Card className='mb-4 ' style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Card.Header style={{backgroundColor: '#e0e0e0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderBottom: 'none' }}>
        <Container className='d-flex justify-content-between p-0'>
          <Col className='d-flex'>
            <img src={avatarImgLink} alt='avatar' style={{ width: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <Link to={`/profile/${post.userId}`} style={{textDecoration: 'none', color: 'black'}} className='align-self-center ms-2'>
              <h5 className='m-0' style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '18px' }}>
                {name}
              </h5>
            </Link>
          </Col>
          <Col className='d-flex flex-row-reverse'>
            <p className='align-self-center m-0'>Created at: {dateCreated}</p>
          </Col>
        </Container>
      </Card.Header>
      <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'black' }}>
        <Card.Body style={{backgroundColor: '#e0e0e0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderBottom: 'none' }}>
          <Card.Text>
            {post.body}
          </Card.Text>
          <Container className='d-flex justify-content-start mb-2 p-0' style={{ overflowX: 'auto' }}>
            {post.image && post.image.map((image, index) => (
              <Image key={index} src={image} style={{ maxWidth: '300px' }} className='me-3 border' />
            ))}
          </Container>
          {post.video && <video className='border' src={post.video} controls width="100%" />}
          {post.sharedPostId && <SharedPostCard postId={post.sharedPostId}/> }
        </Card.Body>
      </Link>
      <Card.Footer style={{ backgroundColor: '#e0e0e0', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Container className='d-flex justify-content-between align-items-center'>
          <Col className='d-flex align-items-center'>
            <FontAwesomeIcon 
              icon={faThumbsUp} 
              className='me-2' 
              style={{cursor: 'pointer', color: isLiked ? 'blue' : 'black'}} 
              onClick={handleClickLike}
            />
            <p className=' m-0'>{likeCount} Like</p>
          </Col>
          <Col className='d-flex align-items-center justify-content-center' >
            <FontAwesomeIcon icon={faComment} className='me-2' />
            <p className=' m-0'>{commentCount} Comment</p>
          </Col>
          <Col className='d-flex align-items-center justify-content-end'>
            <FontAwesomeIcon icon={faShare} className='me-2' style={{cursor: 'pointer'}} onClick={handleSharePost} />
            <p className=' m-0'>Share</p>
          </Col>
        </Container>
        <SharePostModal show={openShare} handleClose={() => setOpenShare(false)} postId={post.id} />
      </Card.Footer>
    </Card>
  )
}
