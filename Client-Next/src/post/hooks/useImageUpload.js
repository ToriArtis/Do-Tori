import { useState } from 'react';

export const useImageUpload = (maxImages = 4) => {
  const [images, setImages] = useState([]);

  const uploadImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > maxImages) {
      alert(`최대 ${maxImages}장의 이미지만 업로드할 수 있습니다.`);
      return;
    }
    setImages(prevImages => [...prevImages, ...files]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return { images, uploadImage, removeImage };
};