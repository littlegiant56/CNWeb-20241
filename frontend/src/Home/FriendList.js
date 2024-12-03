import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getFriendList } from "../services/API";

export default function FriendList({ conversations, setConversations }) {
  const [friends, setFriends] = useState([]);
  const [hoveredFriend, setHoveredFriend] = useState(null);

  useEffect(() => {
    // Fetch friend list from API
    getFriendList(localStorage.getItem("userId"))
      .then((res) => {
        setFriends(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleNewMessage = (receivedUserId) => {
    // Check if conversation already exists
    if (
      conversations.find(
        (conversation) => conversation.receivedUserId === receivedUserId
      )
    )
      return;

    // Add new message to the message container
    setConversations([
      ...conversations,
      {
        sentUserId: localStorage.getItem("userId"),
        receivedUserId: receivedUserId,
        message: [],
      },
    ]);
  };

  return (
    <Container>
      <h4
        style={{
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          fontSize: "25px",
        }}
      >
        Friends List
      </h4>
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="d-flex p-1 rounded-2 mb-3"
          style={{
            cursor: "pointer",
            border: "none",
            backgroundColor:
              hoveredFriend === friend.id ? "#f0f0f0" : "transparent",
            transform: hoveredFriend === friend.id ? "scale(1.02)" : "scale(1)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={() => setHoveredFriend(friend.id)}
          onMouseLeave={() => setHoveredFriend(null)}
          onClick={() => handleNewMessage(friend.id)}
        >
          <img
            src={friend.avatar}
            alt="avatar"
            style={{
              width: "40px",
              borderRadius: "50%",
              border: "1px solid #aaa", // Giữ viền cho ảnh
            }}
          />
          <h5
            className="align-self-center ms-2"
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {friend.firstName + " " + friend.lastName}
          </h5>
        </div>
      ))}
    </Container>
  );
}
