import React, { useState } from 'react'
import { Container, Form, Button, FormGroup } from 'react-bootstrap'
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
      toast.success(res.data.message)
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
        style={{ width: '500px', marginTop: '25px', color: 'white' }}
      >
        <Form className="d-flex flex-column" onSubmit={handleSubmit}>
          <h1 className="align-self-center">Thiết lập tài khoản</h1>
          
          <FormGroup className="mb-2">
            <Form.Label>Họ</Form.Label>
            <Form.Control
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Họ"
              required
            />
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="Tên"
              required
            />
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              type="date"
              placeholder="Ngày sinh"
            />
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Địa chỉ"
            />
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </Form.Select>
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Trường học</Form.Label>
            <Form.Control
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              type="text"
              placeholder="Trường học"
            />
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Công việc</Form.Label>
            <Form.Control
              value={work}
              onChange={(e) => setWork(e.target.value)}
              type="text"
              placeholder="Công việc"
            />
          </FormGroup>
          
          <FormGroup className="mb-2">
            <Form.Label>Mô tả bản thân</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              rows={3}
              placeholder="Mô tả bản thân"
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
          
          <FormGroup className="mb-2">
            <Form.Label>Ảnh bìa</Form.Label>
            <Form.Control
              onChange={(e) => setCover(e.target.files[0])}
              type="file"
              accept="image/*"
            />
          </FormGroup>
          
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          
          <Button className="align-self-center mb-2" type="submit" style={{ width: '100px' }}>
            Xác nhận
          </Button>
        </Form>
      </Container>
    </div>
  );
}
