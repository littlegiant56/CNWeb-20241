import React from 'react'
import { Container, Form, Button, FormGroup } from 'react-bootstrap'
import './app.css'

export default function SetupAccount() {
  
  return (
    <div className='signup-login'>
      <Container className='container shadow border p-4 pb-0 rounded-2' style={{width: '500px', marginTop: '25px', color:'white'}}>
        <Form className='d-flex flex-column'>
          <h1 className='align-self-center'>Thiết lập tài khoản</h1>
          <FormGroup className='mb-2'>
            <Form.Label>Họ</Form.Label>
            <Form.Control  type="text" placeholder='Họ' required/>
          </FormGroup>
          <FormGroup className='mb-2'>
            <Form.Label>Tên</Form.Label>
            <Form.Control type="text" placeholder='Tên' required/>
          </FormGroup>
          <FormGroup className='mb-2'>
            <Form.Label>Avatar</Form.Label>
            <Form.Control type="file"/>
          </FormGroup>
          <FormGroup className='mb-2'>
            <Form.Label>Ảnh bìa</Form.Label>
            <Form.Control type="file" placeholder='Tên'/>
          </FormGroup>
          <Button className='align-self-center mb-2' type='submit' style={{width: '100px'}}>Xác nhận</Button>
        </Form>
      </Container>
    </div>
  )
}
