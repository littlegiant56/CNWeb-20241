import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { getNotificationByUserId } from '../services/API';
import { NotificationTile } from './NotificationTile';

export default function NotificationsContainer() {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  // Hàm đóng thông báo
  const closeNotification = () => {
    setIsNotificationVisible(false);
  };

  useEffect(() => {
    getNotificationByUserId(localStorage.getItem('userId'))
      .then(res => {
        setNotifications(res.data.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    // Chỉ render container nếu isNotificationVisible là true
    isNotificationVisible && (
      <Container className='border rounded z-1' style={{ position: "fixed", top: '70px', right: '10px', width: '300px', backgroundColor: '#e0e0e0' }}>
        <h3>Notification</h3>
        {notifications.map((notification, index) => (
          <NotificationTile
            key={index}
            notification={notification}
            onNotificationClick={closeNotification} // Truyền hàm đóng thông báo vào đây
          />
        ))}
      </Container>
    )
  );
}
