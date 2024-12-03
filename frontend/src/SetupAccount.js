import React, { useState } from 'react'
import { Container, Form, Button, FormGroup ,Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import { updateProfile } from './services/API';
import { toast } from 'react-toastify';
import './app.css'

export default function SetupAccount() {
  const location = useLocation()
  const { user } = location.state

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DOB, setDOB] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [school, setSchool] = useState('');
  const [work, setWork] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState();
  const [cover, setCover] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    let formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('DOB', DOB);
    formData.append('address', address);
    formData.append('gender', gender);
    formData.append('school', school);
    formData.append('work', work);
    formData.append('description', description);
    formData.append('avatar', avatar);
    formData.append('cover', cover);
    
    updateProfile(user.uid, formData)
    .then(res => {
      toast.success(res.data.message,{ autoClose: 3000 })
      navigate("/login")
    })
    .catch(err => {
      setErrorMessage(err.message);
    })
  }

  return (
    <div className="signup-login">
      <Container
        className="container-lg shadow border p-4 pb-0 rounded-2"
        style={{ width: '550px', marginTop: '25px', color: 'white' }}
      >
        <Form className="d-flex flex-column" onSubmit={handleSubmit}>
          <h1 className="align-self-center">Set up account</h1>
          
          <Row>
            <Col md={6}>
              <FormGroup className="mb-2">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  required
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Date of birth</Form.Label>
                <Form.Control
                  value={DOB}
                  onChange={(e) => setDOB(e.target.value)}
                  type="date"
                  placeholder="Date of birth"
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>School/Office</Form.Label>
                <Form.Control
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  type="text"
                  placeholder="School/Office"
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  onChange={(e) => setAvatar(e.target.files[0])}
                  type="file"
                  accept="image/*"
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-2">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  required
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Address"
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Work</Form.Label>
                <Form.Control
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  type="text"
                  placeholder="Work"
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  as="textarea"
                  rows={1}
                  placeholder="Description"
                />
              </FormGroup>

              <FormGroup className="mb-2">
                <Form.Label>Cover photo</Form.Label>
                <Form.Control
                  onChange={(e) => setCover(e.target.files[0])}
                  type="file"
                  accept="image/*"
                />
              </FormGroup>
            </Col>
          </Row>
          
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          
          <Button className='signup-login-button align-self-center mb-3 mt-3' type='submit' style={{ width: '120px'}}>
            Confirm
          </Button>
        </Form>
      </Container>
    </div>
  );
}
