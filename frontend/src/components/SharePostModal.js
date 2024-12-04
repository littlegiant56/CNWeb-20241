import React, { useEffect, useState } from "react";
import { Button, Card, Container, Image, Modal } from "react-bootstrap";
import { getPostById, getProfileByUserId, sharePost } from "../services/API";
import { toast } from "react-toastify";

export default function SharePostModal({ show, handleClose, postId }) {
  const [post, setPost] = useState();
  const [userProfile, setUserProfile] = useState();
  const [body, setBody] = useState("");

  const handleSharePost = () => {
    sharePost(postId, { body, userId: localStorage.getItem("userId") }).then(
      (res) => {
        toast.success("Share article successfully", { autoClose: 3000 });
        handleClose();
      }
    );
  };

  useEffect(() => {
    // Fetch post by id
    getPostById(postId)
      .then((res) => {
        setPost(res.data.data);
        return res.data.data;
      })
      .then((post) => {
        getProfileByUserId(post.userId)
          .then((res) => {
            setUserProfile(res.data.user);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }, [postId]);

  return (
    <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Share this post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="form-control mb-2"
          style={{ border: 0 }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share ..."
        />
        <Card>
          <Card.Header>
            <Image
              className="me-2"
              src={userProfile?.avatar}
              roundedCircle
              style={{
                width: "30px",
                height: "30px",
                border: "1px solid #aaa",
              }}
            />
            <span className="ml-2">
              {userProfile?.firstName} {userProfile?.lastName}
            </span>
          </Card.Header>
          <Card.Body>
            <Card.Text>{post?.body}</Card.Text>
            <Container
              className="d-flex justify-content-start mb-2 p-0"
              style={{ overflowX: "auto" }}
            >
              {post?.image &&
                post.image.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    style={{ maxWidth: "300px" }}
                    className="me-3 border"
                  />
                ))}
            </Container>
            {post?.video && (
              <video
                className="border"
                src={post.video}
                controls
                width="100%"
              />
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSharePost}>
          Share
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
