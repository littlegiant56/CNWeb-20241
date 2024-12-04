import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getAllConversationByUserId } from "../services/API";
import { ConversationTile } from "./ConversationTile";

export default function ConversationList({ conversations, setConversations }) {
  const [conversationsList, setConversationsList] = useState([]);
  const [isConversationListVisible, setIsConversationListVisible] =
    useState(true); // Trạng thái hiển thị/ẩn danh sách cuộc trò chuyện

  useEffect(() => {
    getAllConversationByUserId(localStorage.getItem("userId"))
      .then((res) => {
        setConversationsList(res.data.conversations);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Hàm đóng danh sách cuộc trò chuyện
  const closeConversationList = () => {
    setIsConversationListVisible(false);
  };

  return (
    // Chỉ render danh sách cuộc trò chuyện nếu isConversationListVisible là true
    isConversationListVisible && (
      <Container
        className="border rounded z-1 p-2"
        style={{
          position: "fixed",
          top: "70px",
          right: "10px",
          width: "300px",
          backgroundColor: "#e0e0e0",
        }}
      >
        <h3
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          Message
        </h3>
        {conversationsList.map((conversation, index) => (
          <ConversationTile
            key={index}
            conversation={conversation}
            conversations={conversations}
            setConversations={setConversations}
            // Truyền hàm đóng danh sách cuộc trò chuyện vào đây
            onConversationClick={closeConversationList}
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "25px",
            }}
          />
        ))}
      </Container>
    )
  );
}
