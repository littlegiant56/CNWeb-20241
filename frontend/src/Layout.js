import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Navbar from './components/Navbar'
import { socket } from './socket'

export default function Layout() {
  return (
    <Container fluid className='p-0 position-relative'>
        <Navbar></Navbar>
        <Container className='p-0 pt-2 position-relative' fluid>
            <Container className='p-0' style={{ width: '60%' }}>
                <Outlet />
            </Container>
        </Container>
    </Container>
  )
}
