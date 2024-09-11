import React, { useEffect, useState, useRef } from 'react';
import { usePostActions } from '../hooks/usePostActions';
import { useAuth } from '../../auth/hooks/useAuth';
import { useImageUpload } from '../hooks/useImageUpload';
import { fetchFollowingUsers } from '../api/postApi';
import Image from 'next/image';
import './css/postCreateBox.css';

const MAX_CHARACTERS = 500;

const PostCreateBox = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [followingUsers, setFollowingUsers] = useState([]);

  const [characterCount, setCharacterCount] = useState(0);

  const { currentUser } = useAuth();
  const { handleCreatePost, error } = usePostActions();
  const { images, uploadImage, removeImage } = useImageUpload(4);  // 최대 4개 이미지

  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const mentionListRef = useRef(null);

  useEffect(() => {
    setCharacterCount(content.length);
  }, [content]);

  useEffect(() => {
    const loadFollowingUsers = async () => {
      const users = await fetchFollowingUsers();
      setFollowingUsers(users);
    };
    loadFollowingUsers();
  }, []);

  const getPercentage = () => (characterCount / MAX_CHARACTERS) * 100;

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('@')) {
      setShowMentionList(true);
      setMentionFilter(lastWord.slice(1).toLowerCase());
      setSelectedMentionIndex(0);
    } else {
      setShowMentionList(false);
      setMentionFilter('');
    }
  };

  const handleKeyDown = (e) => {
    if (showMentionList) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => (prev + 1) % filteredUsers.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleMention(filteredUsers[selectedMentionIndex]);
      }
    }
  };

  const handleMention = (user) => {
    const textarea = document.querySelector('.text-area');
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('@')) {
      words[words.length - 1] = `@${user.nickName}`;
      const newTextBeforeCursor = words.join(' ');
      const newContent = newTextBeforeCursor + ' ' + textAfterCursor;
      setContent(newContent);
      
      // 커서 위치 조정
      const newCursorPosition = newTextBeforeCursor.length + 1;
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      const newContent = textBeforeCursor + `@${user.nickName} ` + textAfterCursor;
      setContent(newContent);
      
      // 커서 위치 조정
      const newCursorPosition = cursorPosition + user.nickName.length + 2;
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
    
    setMentionedUsers([...mentionedUsers, user]);
    setShowMentionList(false);
  };

  // 추가 
  const filteredFollowingUsers = followingUsers.filter(user => 
    user.nickName.toLowerCase().includes(mentionFilter)
  );
  const filteredUsers = followingUsers.filter(user => 
    user.nickName.toLowerCase().includes(mentionFilter)
  );

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      setTags(prevTags => [...prevTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(prevTags => prevTags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    try {
      const postData = {
        content: content,
        tags,
        mentionedUserIds: mentionedUsers.map(user => user.id).join(','),
        images
      };
  
      await handleCreatePost(postData);
      setContent('');
      setTags([]);
      setMentionedUsers([]);
      onPostCreated();
    } catch (error) {
      console.error('게시글 등록 실패:', error);
    }
  };

  return (
    <div className="post-create-card">
      <div className="user-info">
        <img
          src={currentUser?.profileImage || '/default-profile.png'}
          alt={currentUser?.nickName || 'User'}
          width={40}
          height={40}
          className="avatar"
        />
        <span>{currentUser?.nickName}</span>
      </div>
      <textarea 
        className="text-area"
        placeholder="무슨 일이 있나요?"
        value={content}
        onChange={handleContentChange}
        maxLength={MAX_CHARACTERS}
        style={{ minHeight: '150px' }}
        onKeyDown={handleKeyDown}
      />
      {showMentionList && (
        <ul className="mention-list" ref={mentionListRef}>
          {filteredUsers.map((user, index) => (
            <li 
              key={user.id} 
              onClick={() => handleMention(user)}
              className={index === selectedMentionIndex ? 'selected' : ''}
            >
              @{user.nickName}
            </li>
          ))}
        </ul>
      )}
      <div className="image-preview-container">
        {images.map((image, index) => (
          <div key={index} className="image-preview-wrapper">
            <img className="image-preview" src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
            <button onClick={() => removeImage(index)}>x</button>
          </div>
        ))}
      </div>
      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button onClick={() => handleRemoveTag(index)}>x</button>
          </span>
        ))}
      </div>
      <div className="button-row">
        <label className="image-label">
          🖼️ 이미지 추가
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadImage}
            className="image-input"
          />
        </label>
        <input
          className="tag-input"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleAddTag}
          placeholder="태그 추가 (Enter)"
        />
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PostCreateBox;