import React, { useState } from "react";
import { Container, Form, Button, Image, Spinner } from "react-bootstrap";
import image from "../assets/icons/image.png";
import video from "../assets/icons/video.png";
import { PreviewImage } from "./PreviewImage";
import { createPost } from "../services/API";
import { toast } from "react-toastify";

export function CreatePost({ posts, setPosts }) {
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Handle selected image
  const onImageSelected = (e) => {
    setSelectedImage([...selectedImage, ...e.target.files]);
  };

  const onVideoSelected = (e) => {
    setSelectedVideo(e.target.files[0]);
  };

  const handleCreatePost = (e) => {
    setIsLoading((isLoading) => !isLoading);
    e.preventDefault();
    // Tạo formData để gửi dữ liệu lên server
    const formData = new FormData();
    formData.append("body", body);
    selectedImage.forEach((image) => {
      formData.append("image", image);
    });
    if (selectedVideo) {
      formData.append("video", selectedVideo);
    }
    formData.append("userId", localStorage.getItem("userId"));
    createPost(formData)
      .then((data) => {
        toast.success(data.data.message, { autoClose: 3000 });
        setPosts([data.data.post, ...posts]);
        // Khởi tạo lại giá trị cho các state
        setBody("");
        setSelectedImage([]);
        setSelectedVideo(null);
        setIsLoading((isLoading) => !isLoading);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return isLoading ? (
    <Spinner animation="border" />
  ) : (
    <Form
      className="mb-4 border"
      onSubmit={handleCreatePost}
      style={{
        backgroundColor: "#fff",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <textarea
        className="form-control mb-2"
        placeholder="What are you thinking?"
        style={{ height: "100px", border: 0 }}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {selectedImage.length > 0 && (
        <Container
          className="d-inline-flex justify-content-start p-2"
          style={{ overflowX: "auto" }}
        >
          {selectedImage &&
            selectedImage.map((img, index) => (
              <PreviewImage
                key={index}
                imageSrc={img}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            ))}
        </Container>
      )}
      {selectedVideo && (
        <Container style={{ position: "relative" }}>
          <button
            style={{ position: "absolute", top: "-20px", right: "-5px" }}
            onClick={() => setSelectedVideo(null)}
            className="btn btn-danger"
          >
            X
          </button>
          <video
            src={URL.createObjectURL(selectedVideo)}
            controls
            width="100%"
            height="100%"
          />
        </Container>
      )}
      <Container className="p-2 d-flex justify-content-between">
        <Container className="d-flex">
          <div className="me-3">
            <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
              <Image src={image} />
            </label>
            <input
              id="image-upload"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={onImageSelected}
              multiple
            />
          </div>
          <div>
            <label htmlFor="video-upload" style={{ cursor: "pointer" }}>
              <Image src={video} />
            </label>
            <input
              id="video-upload"
              type="file"
              style={{ display: "none" }}
              accept="video/*"
              onChange={onVideoSelected}
            />
          </div>
        </Container>
        <Button type="submit">Post</Button>
      </Container>
    </Form>
  );
}
