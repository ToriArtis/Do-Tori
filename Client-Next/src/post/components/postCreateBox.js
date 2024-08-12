import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createPost, fetchFollowingUsers } from '../api/postApi';
import './css/postCreateBox.css';

const MAX_CHARACTERS = 500; // 최대 글자 수

const PostCreateBox = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [nickName, setNickName] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);
  const [characterCount, setCharacterCount] = useState(0);

  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');

  useEffect(() => {
    const userNickName = localStorage.getItem('USER_NICKNAME');
    setNickName(userNickName || '익명');
    fetchFollowingUsers().then(users => setFollowingUsers(users));
  }, []);

  useEffect(() => {
    setCharacterCount(content.length);
  }, [content]);

  const getPercentage = () => (characterCount / MAX_CHARACTERS) * 100;


  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    const words = newContent.split(' ');
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('@')) {
      setShowMentionList(true);
      setMentionFilter(lastWord.slice(1).toLowerCase());
    } else {
      setShowMentionList(false);
      setMentionFilter('');
    }
  };

  const handleMention = (user) => {
    const words = content.split(' ');
    words.pop();
    const newContent = [...words, `@${user.nickName}`].join(' ') + ' ';
    setContent(newContent);
    setMentionedUsers([...mentionedUsers, user]);
    setShowMentionList(false);
  };

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
      if (mentionedUsers.length > 0) {
        const mentionedUserIds = mentionedUsers.map(user => user.id).join(',');
        formData.append('mentionedUserIds', mentionedUserIds);
      }
      await createPost(formData);
      setContent('');
      setImages([]);
      setTags([]);
      setMentionedUsers([]);
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
<div className="post-create-card">
      <div className="user-info">
        <div className="avatar" />
        <span>{nickName}</span>
      </div>
      <input
        className="tag-input"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyPress={handleAddTag}
        placeholder="태그 추가 (Enter)"
      />
      <textarea 
        className="text-area"
        placeholder="무슨 일이 있나요?"
        value={content}
        onChange={handleContentChange}
        maxLength={MAX_CHARACTERS}
      />
      {showMentionList && (
        <ul className="mention-list">
          {followingUsers
            .filter(user => user.nickName.toLowerCase().includes(mentionFilter))
            .map(user => (
              <li key={user.id} className="mention-item" onClick={() => handleMention(user)}>
                @{user.nickName}
              </li>
            ))}
        </ul>
      )}
      <div className="image-preview-container">
        {images.map((image, index) => (
          <img key={index} className="image-preview" src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
        ))}
      </div>
      
      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      <div className="button-row">
        <label className="image-label">
          🖼️ 이미지 추가
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="image-input"
          />
        </label>
        <div className='post-create-character-counter'>
        <div className="character-counter">
        <svg viewBox="0 0 44 44" className="character-counter-svg">
          <circle className="character-counter-circle" cx="22" cy="22" r="20" />
          <circle 
            className="character-counter-fill-circle" 
            cx="22" 
            cy="22" 
            r="20"
            style={{
              strokeDasharray: 126,
              strokeDashoffset: 126 - (getPercentage() / 100) * 126
            }}
          />
        </svg>
        <span className="character-count-text">{characterCount}</span>
      </div>
        <button className="submit-button" onClick={handleSubmit}>등록</button>
        </div>
      </div>
    </div>
  );
};

export default PostCreateBox;