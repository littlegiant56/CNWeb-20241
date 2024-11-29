import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';

/**
 * Renders a preview image component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.imageSrc - The source of the image.
 * @param {Array} props.selectedImage - The array of selected images.
 * @param {Function} props.setSelectedImage - The function to set the selected images.
 * @returns {JSX.Element} The preview image component.
 */
export function PreviewImage({ imageSrc, selectedImage, setSelectedImage }) {

  const [imageURL, setImageURL] = useState();

  useEffect(() => {
    setImageURL(URL.createObjectURL(imageSrc));
  }, [selectedImage]);

  const handleRemoveImage = () => {
    const newImages = selectedImage.filter((image) => image !== imageSrc);
    setSelectedImage(newImages);
  };

  return (
    <Container className='me-3' style={{ position: 'relative' }}>
      <div className='border rounded bg-danger p-1' style={{ position: 'absolute', cursor: 'pointer', top: "-10px",  }} onClick={handleRemoveImage}>
        <p className='m-0' style={{color: '#fff'}}>X</p>
      </div>
      <img src={imageURL} style={{ maxWidth: '200px', maxHeight: '400px' }} />
    </Container>
  );
}
