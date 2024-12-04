import React, { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { getCommentByPostId, getProfileByUserId } from "../services/API";
import { socket } from "../socket";
import "../app.css";
export default function CommentSection({ postUserId, postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");

  // Lấy tất cả comment từ server
  function getAllComments() {
    getCommentByPostId(postId)
      .then((res) => {
        // Map qua tất cả comment để lấy thêm thông tin người dùng (name, avatar)
        const promises = res.data.data.map((comment) =>
          getProfileByUserId(comment.userId).then((userRes) => ({
            ...comment,
            name: `${userRes.data.user.firstName} ${userRes.data.user.lastName}`,
            avatar: userRes.data.user.avatar,
          }))
        );

        Promise.all(promises).then((commentsWithUserData) => {
          setComments(commentsWithUserData);
        });
        console.log(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }

  // Lấy thông tin avatar của người dùng hiện tại
  function getCurrentUserInfo() {
    const userId = localStorage.getItem("userId");
    getProfileByUserId(userId)
      .then((res) => {
        setCurrentUserAvatar(res.data.user.avatar);
      })
      .catch((error) => {
        console.error("Error fetching current user info:", error);
      });
  }

  useEffect(() => {
    getCurrentUserInfo();
    getAllComments();
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const commentData = {
      sentUsername: localStorage.getItem("username"),
      userId: localStorage.getItem("userId"),
      postId: postId,
      postUserId: postUserId,
      content: newComment,
    };

    socket.emit("createComment", commentData);

    // Thêm bình luận mới vào đầu danh sách comments
    setComments((prevComments) => [
      ...prevComments,
      {
        ...commentData,
        avatar: currentUserAvatar,
        name: localStorage.getItem("username"),
        body: newComment,
      },
    ]);

    setNewComment("");
  };

  return (
    <Container className="p-0">
      {/* Form nhập comment */}
      <Form className="d-flex mb-2 align-items-center" onSubmit={handleSubmit}>
        <img
          src={currentUserAvatar}
          alt="avatar"
          style={{
            width: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "10px",
            border: "1px solid #aaa",
          }}
        />
        <Form.Group className="me-2" style={{ width: "100%" }}>
          <Form.Control
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>

      {/* Hiển thị danh sách comment */}
      <Container className="p-0">
        {comments.map((comment, index) => (
          <Row key={index} className="mb-3 align-items-center">
            <Col xs="auto">
              <img src={comment.avatar} alt="avatar" className="avatar-img" />
            </Col>
            <Col>
              <h6 className="m-0" style={{ fontWeight: "bold" }}>
                {comment.name}
              </h6>
              <p className="m-0">{comment.body}</p>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
}
