import React from 'react';
import { Container, Form } from 'react-bootstrap';

function SearchBar() {
    return (
        <Container className='searchInputs d-flex'>
          <Form id='Search' className="justify-content-center">
            <Form.Control
              className='rounded-pill' type="text" placeholder="Tìm kiếm"
              style={{ height: '50px' }}
            />
          </Form>
        </Container>
      )
    }
    
export default SearchBar