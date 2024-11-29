import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Image } from 'react-bootstrap'
import heart_red from '../assets/icons/heart_red.png'
import heart from '../assets/icons/heart.png'
import comment from '../assets/icons/comment.png'
import share from '../assets/icons/share.png'
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
    <Card className='mb-2' >
      <Card.Header>
        <Container className='d-flex justify-content-between p-0'>
          <Col className='d-flex'>
            <img src={avatarImgLink} alt='avatar' style={{ width: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <Link to={`/profile/${post.userId}`} style={{textDecoration: 'none', color: 'black'}} className='align-self-center ms-2'>
              <h5 className='m-0'>
                {name}
              </h5>
            </Link>
          </Col>
          <Col className='d-flex flex-row-reverse'>
            <p className='align-self-center m-0'>Tạo lúc: {dateCreated}</p>
          </Col>
        </Container>
      </Card.Header>
      <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'black' }}>
        <Card.Body>
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
      <Card.Footer>
        <Container className='d-flex justify-content-between'>
          <Col className='d-flex'>
            <Image className='me-2' style={{cursor: 'pointer'}} src={isLiked ? heart_red : heart} onClick={handleClickLike} />
            <p className='align-self-center m-0'>{likeCount} lượt thích</p>
          </Col>
          <Col className='d-flex'>
            <Image className='me-2' src={comment} />
            <p className='align-self-center m-0'>{commentCount} bình luận</p>
          </Col>
          <Col className='d-flex'>
            <Image className='me-2' style={{cursor: 'pointer'}} src={share} onClick={handleSharePost}/>
            <p className='align-self-center m-0'>Chia sẻ</p>
          </Col>
        </Container>
        <SharePostModal show={openShare} handleClose={() => setOpenShare(false)} postId={post.id} />
      </Card.Footer>
    </Card>
  )
}
