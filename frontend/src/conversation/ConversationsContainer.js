import React from "react";
import { Container } from "react-bootstrap";
import ConversationPanel from "./ConversationPanel";

export default function ConversationsContainer({
  conversations,
  setConversations,
}) {
  return (
    <Container
      fluid
      className="d-inline-block position-fixed m-0 d-flex flex-row-reverse "
      style={{ bottom: "0px", width: "auto", right: "20px" }}
    >
      {conversations.map((conversation, index) => (
        <ConversationPanel
          key={index}
          conversation={conversation}
          conversations={conversations}
          setConversations={setConversations}
        />
      ))}
    </Container>
  );
}
