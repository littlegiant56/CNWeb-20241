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
    <div className='signup-login'>
      <Container className='container-lg shadow border p-4 pb-0 rounded-2' style={{width: '500px', marginTop: '25px', color:'white'}}>
        <Form className='d-flex flex-column' onSubmit={handleSubmit}>
          <h1 className='align-self-center'>Thiết lập tài khoản</h1>
          <FormGroup className='mb-2'>
            <Form.Label>Họ</Form.Label>
            <Form.Control value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder='Họ' required/>
          </FormGroup>
          <FormGroup className='mb-2'>
            <Form.Label>Tên</Form.Label>
            <Form.Control value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder='Tên' required/>
          </FormGroup>
          <FormGroup className='mb-2'>
            <Form.Label>Avatar</Form.Label>
            <Form.Control onChange={e => setAvatar(e.target.files[0])} type="file"/>
          </FormGroup>
          <FormGroup className='mb-2'>
            <Form.Label>Ảnh bìa</Form.Label>
            <Form.Control onChange={e => setCover(e.target.files[0])} type="file" placeholder='Tên'/>
          </FormGroup>
          {errorMessage && <p className='text-danger'>{errorMessage}</p>}
          <Button className='align-self-center mb-2' type='submit' style={{width: '100px'}}>Xác nhận</Button>
        </Form>
      </Container>
    </div>
  )
}
