import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createPost } from '../api/postApi';

const PostCreateCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  border: none;
  resize: none;
  font-size: 16px;
  margin-bottom: 10px;
  &:focus {
    outline: none;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ImageButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: #ccbfb2;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const ImagePreview = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageLabel = styled.label`
  cursor: pointer;
  display: inline-block;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-right: 10px;
`;

const PostCreateBox = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [nickName, setNickName] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userNickName = localStorage.getItem('USER_NICKNAME');
    setNickName(userNickName || '익명');
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert('최대 4장의 이미지만 첨부할 수 있습니다.');
      return;
    }
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleSubmit = async () => {
    if (!content || content.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      images.forEach(image => {
        formData.append('files', image);
      });
      await createPost(formData);
      setContent('');
      setImages([]);
      if (onPostCreated) {
        onPostCreated();
      }
      alert('게시글이 등록되었습니다.');
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다. 오류: ' + error.message);
    }
  };

  return (
    <PostCreateCard>
      <UserInfo>
        <Avatar />
        <span>{nickName}</span>
      </UserInfo>
      <TextArea 
        placeholder="무슨 일이 있나요?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImagePreview key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
        ))}
      </ImagePreviewContainer>
      <ButtonRow>
        <ImageLabel>
          🖼️ 이미지 추가
          <ImageInput
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </ImageLabel>
        <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
      </ButtonRow>
    </PostCreateCard>
  );
};

export default PostCreateBox;
