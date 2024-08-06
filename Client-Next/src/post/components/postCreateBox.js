import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createPost } from '../api/postApi';

const PostCreateCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 90%;
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

const TagInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 2px 5px;
  border-radius: 3px;
`;

const CharacterCounter = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const CharacterCounterSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 44px; /* stroke-width의 영향을 고려하여 4px을 추가 */
  height: 44px; /* stroke-width의 영향을 고려하여 4px을 추가 */
  transform: rotate(-90deg);
`;

const CharacterCounterCircle = styled.circle`
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 4;
  cx: 22;
  cy: 22;
  r: 20;
`;

const CharacterCounterFillCircle = styled.circle`
  fill: none;
  stroke: black;
  stroke-width: 4;
  cx: 22;
  cy: 22;
  r: 20;
  stroke-dasharray: 126; /* 2 * Math.PI * radius (2 * 3.14 * 20) */
  stroke-dashoffset: ${props => 126 - (props.percentage / 100) * 126};
  transition: stroke-dashoffset 0.3s ease;
`;

const CharacterCountText = styled.span`
  position: relative;
  z-index: 1;
  font-size: 12px;
`;

const MAX_CHARACTERS = 500; // 최대 글자 수

const PostCreateBox = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [nickName, setNickName] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const userNickName = localStorage.getItem('USER_NICKNAME');
    setNickName(userNickName || '익명');
  }, []);

  useEffect(() => {
    setCharacterCount(content.length);
  }, [content]);

  const getPercentage = () => (characterCount / MAX_CHARACTERS) * 100;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      alert('최대 4장의 이미지만 첨부할 수 있습니다.');
      return;
    }
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      setTags(prevTags => [...prevTags, newTag.trim()]); // 배열에 문자열만 추가
      setNewTag('');
    }
  };

  const handleSubmit = async () => {
    if (!content || content.trim() === '') {
      alert('내용을 입력해주세요.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      if (images.length > 0) {
        images.forEach(image => {
          formData.append('files', image);
        });
      }
      if (tags.length > 0) {
        tags.forEach(tag => {
          formData.append('tags', tag);
        });
      }
      await createPost(formData);
      setContent('');
      setImages([]);
      setTags([]);
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
      <TagInput
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyPress={handleAddTag}
        placeholder="태그 추가 (Enter)"
      />
      <TextArea 
        placeholder="무슨 일이 있나요?"
        value={content}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARACTERS) {
            setContent(e.target.value);
          }
        }}
        maxLength={MAX_CHARACTERS}
      />
      <CharacterCounter>
        <CharacterCounterSvg viewBox="0 0 44 44">
          <CharacterCounterCircle />
          <CharacterCounterFillCircle percentage={getPercentage()} />
        </CharacterCounterSvg>
        <CharacterCountText>{characterCount}</CharacterCountText>
      </CharacterCounter>
      <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImagePreview key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
        ))}
      </ImagePreviewContainer>
      
      <TagList>
        {tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </TagList>
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