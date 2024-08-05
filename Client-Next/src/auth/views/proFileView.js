import React, { useState } from 'react';
import useInfoViewModel from '../viewmodels/useInfoViewModel';
import { modify } from '../api/authApi';
import "../components/css/profile.css";

export default function ProfileView() {
  const userInfo = useInfoViewModel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedNickName, setEditedNickName] = useState('');
  const [editedBio, setEditedBio] = useState('');

  // 모달창
  const handleEditProfile = () => {
    setEditedNickName(userInfo.nickName);
    setEditedBio(userInfo.bio);
    setIsModalOpen(true);
  };

  // 프로필 저장
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // 닉네임과 바이오만 수정
      await modify({ nickName: editedNickName, bio: editedBio });
      setIsModalOpen(false);
      window.location.reload(); // 페이지를 새로고침하여 변경사항을 반영
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    }
  };


  return (
    <div className="profile-container">
      {/* 헤더 이미지 */}
      <div className="header-image-container">
        
      </div>
      
      <div className="profile-info">
        {/* 프로필 이미지 */}
        <div className="profile-image-container">
          
        </div>
        
        <h2>{userInfo.nickName}</h2>
        <p>{userInfo.bio || '자신을 소개해보세요'}</p>
        
        <div className="follow-info">
          <span>10 팔로잉</span>
          <span>10 팔로워</span>
        </div>
        
        <button onClick={handleEditProfile} className="edit-button">프로필 수정</button></div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">X</button>
            <form onSubmit={handleSaveProfile}>
              <input
                type="text"
                value={editedNickName}
                onChange={(e) => setEditedNickName(e.target.value)}
                placeholder="닉네임"
              />
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="자신을 소개해보세요"
              />
              <button type="submit">저장</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}