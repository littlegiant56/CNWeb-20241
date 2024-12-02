import React, { useEffect, useState } from 'react'
import { Container, Button, Image } from 'react-bootstrap'
import backIcon from '../assets/icons/back_icon.png'
import { Link } from 'react-router-dom';


export default function ImageSlideShow({ images }) {

  const [imagePosition, setImagePosition] = useState(0);

  const handlePreviousImage = () => {
    setImagePosition(Math.max(0, Number(imagePosition) - 1));
  }

  const handleNextImage = () => {
    setImagePosition(Math.min(images.length - 1, Number(imagePosition) + 1));
  }

  return (
    <Container className='z-1'>
      <Button className='p-0 border-0 align-self-center ms-3 me-2' style={{ width: '30px', background: 'black' }} onClick={handlePreviousImage}>
        <Image style={{ width: '30px' }} src={backIcon} />
      </Button>
      <Link to={`image`} state={{imagePosition: imagePosition}}>
        <Image className='object-fit-scale me-2' src={images[imagePosition]} style={{ maxHeight: '50vh', maxWidth: '40%' }} />
      </Link>
      {imagePosition + 1 < images.length && 
      <Link to={`image`} state={{imagePosition: imagePosition + 1}}>
        <Image className='object-fit-scale' src={images[imagePosition + 1]} style={{ maxHeight: '50vh', maxWidth: '40%' }} />
      </Link>
      }
      <Button className='p-0 border-0 align-self-center me-2 ms-2' style={{ width: '30px', background: 'black' }} onClick={handleNextImage}>
        <Image style={{ width: '30px', transform: 'rotate(180deg)' }} src={backIcon} />
      </Button>
    </Container>
  )
}
