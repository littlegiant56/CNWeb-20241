import React, { useEffect, useState } from 'react'
import { Container, Card, Col, Row, Image } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getPostById, getProfileByUserId, removeLikePost } from '../services/API';
import { socket } from '../socket'
import heart from '../assets/icons/heart.png'
import heart_red from '../assets/icons/heart_red.png'
import comment from '../assets/icons/comment.png'
import share from '../assets/icons/share.png'
import CommentSection from '../components/CommentSection';
import ImageSlideShow from './ImageSlideShow';
import SharedPostCard from '../components/SharedPostCard';
import SharePostModal from '../components/SharePostModal';

export default function DetailPost() {

  const { id } = useParams()
  const [post, setPost] = useState();
  const [name, setName] = useState("");
  const [avatarImgLink, setAvatarImgLink] = useState();
  const [dateCreated, setDateCreated] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [openShare, setOpenShare] = useState(false);

  let getUserInfo = (post) => {
    getProfileByUserId(post.userId)
      .then(res => {
        setName(res.data.user.firstName + " " + res.data.user.lastName);
        setAvatarImgLink(res.data.user.avatar);
      })
      const fireBaseTime = new Date(
        post.dateCreated.seconds * 1000 + post.dateCreated.nanoseconds / 1000000,
      );
    setDateCreated(fireBaseTime.toLocaleTimeString('vi-VN') + " " + fireBaseTime.toLocaleDateString('vi-VN'))
  }

  const handleClickLike = () => {
    setIsLiked(isLiked => !isLiked);
    if (isLiked) {
      removeLikePost(localStorage.getItem('userId'), id);
      setLikeCount(likeCount => likeCount - 1);
    } else {
      socket.emit("likePost", {
        sentUsername: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        postId: id,
        postUserId: post.userId
      })
      setLikeCount(likeCount => likeCount + 1);
    }
  }

  const handleSharePost = () => {
    setOpenShare(true)
  }

  useEffect(() => {
    // Fetch post by id
    getPostById(id)
      .then(res => {
        setPost(res.data.data);
        setIsLiked(res.data.data.likedList.includes(localStorage.getItem('userId')));
        setLikeCount(res.data.data.likedList.length);
        setCommentCount(res.data.data.comments.length);
        getUserInfo(res.data.data);
      })
      .catch(error => {
        console.log(error)
      })
  }, [id])

  return (
    post && 
    <Container className='w-75'>
      <Card className='mb-2'>
        <Card.Header>
          <Container className='d-flex justify-content-between p-0'>
            <Col className='d-flex'>
              <img src={avatarImgLink} alt='avatar' style={{width: '40px', borderRadius: '50%' }} />
              <Link to={`/profile/${post.userId}`} style={{textDecoration: 'none', color: 'black'}}>
                <h5 className='align-self-center ms-2'>{name}</h5>
              </Link>
            </Col>
            <Col className='d-flex flex-row-reverse'>
              <p className='align-self-center m-0'>Tạo lúc: {dateCreated}</p>
            </Col>
          </Container>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {post.body}
          </Card.Text>
          {post.image && post.image.length > 0 && <ImageSlideShow images={post.image} />}
          {post.video && <video className='border' src={post.video} controls width="100%" />}
          {post.sharedPostId && <SharedPostCard postId={post.sharedPostId} />}
        </Card.Body>
        <Card.Footer>
          <Container className='d-flex justify-content-between'>
            <Col className='d-flex'>
              <Image className='me-2' src={isLiked ? heart_red : heart} onClick={handleClickLike}/>
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
          <SharePostModal show={openShare} handleClose={() => setOpenShare(false)} postId={id} />
        </Card.Footer>
      </Card>
      <CommentSection postId={id} postUserId={post.userId}/>
    </Container>
  )
}
