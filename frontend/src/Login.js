import React from 'react'
import { Container, Form, FormGroup, Button } from 'react-bootstrap'
import './app.css'

export default function Login() {
  return (
    <div className='signup-login'>
      <Container className='container shadow border p-4 pb-0 rounded-2' style={{width: '450px', marginTop: '30px',color: 'white'}}>
        <Form className='d-flex flex-column'>
          <h1 className='align-self-center'>Đăng nhập</h1>
          <FormGroup className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder='Email' />
          </FormGroup>
          <FormGroup className='mb-3 position-relative'>
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control type="password" placeholder='Mật khẩu' />
          </FormGroup>
          <Button className='signup-login-button align-self-center mb-2' type='submit' style={{width: '150px'}}>Đăng nhập</Button>
          <p className='align-self-center'>Chưa có tài khoản?</p>
        </Form>
      </Container>
    </div>
  )
}
