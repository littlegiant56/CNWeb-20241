import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getProfileByUserId } from '../services/API';

export function NotificationTile({ notification, onNotificationClick }) {
  const [profileUser, setProfileUser] = useState();

  useEffect(() => {
    getProfileByUserId(notification.userId)
      .then(res => {
        setProfileUser(res.data.user);
      })
      .catch(err => {
        console.log(err);
      });
  }, [notification]);

  const handleClickNotification = () => {
    if (onNotificationClick) {
      onNotificationClick(); // Gọi hàm đóng container
    }
  };

  return (
    profileUser && (
      <Link to={`/post/${notification.postId}`} style={{ textDecoration: 'none', color: 'black' }} onClick={handleClickNotification}>
        <Container id="tile" className='p-0 d-flex'>
          <img className='border me-2 mb-2' src={profileUser?.avatar} alt={profileUser?.username} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #aaa !important' }} />
          <p>{notification.sentUsername} {notification.type === "like" ? "liked" : "commented"} your post</p>
        </Container>
      </Link>
    )
  );
}
