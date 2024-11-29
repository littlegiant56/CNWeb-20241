import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { getNotificationByUserId } from '../services/API'
import { NotificationTile } from './NotificationTile'

export default function NotificationsContainer() {

	const [notifications, setNotifications] = useState([])

	useEffect(() => {
		getNotificationByUserId(localStorage.getItem('userId'))
			.then(res => {
				setNotifications(res.data.data.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

  return (
    <Container className='border rounded z-1' style={{position: "fixed", top: '70px', right: '10px', width: '300px', backgroundColor: '#fff'}}>
			<h3>Thông báo</h3>
			{notifications.map((notification, index) => (
				<NotificationTile key={index} notification={notification} />
			))}
    </Container>
  )
}
