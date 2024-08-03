import React, { useState, useEffect } from 'react';
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

const PostCreateBox = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [nickName, setNickName] = useState('');

  useEffect(() => {
    // 로컬스토리지에서 닉네임 가져옴
    const userNickName = localStorage.getItem('USER_NICKNAME');
    setNickName(userNickName || '익명');
  }, []);

const handleSubmit = async () => {
  if (!content || content.trim() === '') {
    alert('내용을 입력해주세요.');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('content', content.trim());
    await createPost(formData);
    setContent('');
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
      <ButtonRow>
        <ImageButton>
          <span role="img" aria-label="Add Image">🖼️</span>
        </ImageButton>
        <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
      </ButtonRow>
    </PostCreateCard>
  );
};

export default PostCreateBox;