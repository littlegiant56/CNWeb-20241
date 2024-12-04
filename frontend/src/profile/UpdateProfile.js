import React, { useEffect, useState } from "react";
import { Container, Image, Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import pen from "../assets/icons/pen.png";
import { updateProfile } from "../services/API";
import { toast } from "react-toastify";

export default function UpdateProfile() {
  const userId = localStorage.getItem("userId");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState();
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [DOB, setDOB] = useState("");
  const [address, setAddress] = useState("");
  const [work, setWork] = useState("");
  const [school, setSchool] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    let formData = new FormData();
    firstName && formData.append("firstName", firstName);
    lastName && formData.append("lastName", lastName);
    avatar && formData.append("avatar", avatar);
    cover && formData.append("cover", cover);
    description && formData.append("description", description);
    DOB && formData.append("DOB", DOB);
    address && formData.append("address", address);
    work && formData.append("work", work);
    school && formData.append("school", school);
    updateProfile(userId, formData)
      .then((res) => {
        toast.success(res.data.message, { autoClose: 3000 });
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="light"
        onClick={handleShow}
        style={{ position: "absolute", bottom: 10, right: 20 }}
      >
        <Image src={pen} style={{ width: 20, marginRight: 10 }}></Image>
        Edit profile
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="updateProfilePopup" onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                onChange={(e) => setAvatar(e.target.files[0])}
                type="file"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cover photo</Form.Label>
              <Form.Control
                onChange={(e) => setCover(e.target.files[0])}
                type="file"
                placeholder="Tên"
              />
            </Form.Group>

            {/* <Image className='border' src={profile.cover} style={{width: '100%', height: 200, objectFit: 'cover'}} rounded /> */}

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First name"
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last name"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of birth</Form.Label>
              <Form.Control
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                placeholder="Date of birth"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Work</Form.Label>
                <Form.Control
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>School/Office</Form.Label>
                <Form.Control
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Gender</Form.Label>
                <Form.Select defaultValue="">
                  <option>Male</option>
                  <option>Female</option>
                </Form.Select>
              </Form.Group>
            </Row>

            {/* <Button variant="primary" type="submit">
              Submit
            </Button> */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            form="updateProfilePopup"
            variant="primary"
            type="submit"
            onClick={handleClose}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
