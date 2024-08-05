import React, { useEffect, useState } from 'react';
import useInfoViewModel from '../viewmodels/useInfoViewModel';
import { modify } from '../api/authApi';
import "../components/css/profile.css";
import SettingView from './settingView';
import { getFollowerCount, getFollowingCount } from '../api/followApi';

export default function ProfileView() {
  const userInfo = useInfoViewModel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedNickName, setEditedNickName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); 
  const [followerCount, setFollowerCount] = useState(0); 
  const [followingCount, setFollowingCount] = useState(0);

  // 사용자 정보 로드후 팔로워/팔로잉 수 가져옴
  useEffect(() => {
    if (userInfo.id) {
      fetchFollowCounts();
    }
  }, [userInfo.id]);


  const fetchFollowCounts = async () => {
    try {
      const followers = await getFollowerCount(userInfo.id);
      const followings = await getFollowingCount(userInfo.id);
      setFollowerCount(followers);
      setFollowingCount(followings);
    } catch (error) {
      console.error('팔로우 수 가져오기 실패:', error);
    }
  };

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
      // 닉네임 바이오만 수정
      await modify({ nickName: editedNickName, bio: editedBio });
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
    }
  };

  // 탭 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
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
            <span>{followingCount} 팔로잉</span>
            <span>{followerCount} 팔로워</span>
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

      {/* 작성글/마음함 tab */}
      <div className="tab-container">
        <div className="tab-menu">
          <button
            className={activeTab === 'posts' ? 'active' : ''}
            onClick={() => handleTabChange('posts')}
          >
            작성글 관리
          </button>
          <button
            className={activeTab === 'likes' ? 'active' : ''}
            onClick={() => handleTabChange('likes')}
          >
            마음함
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'posts' ? (
            <div>
              {/* 작성글 목록 표시 */}
              <SettingView />
            </div>
          ) : (
            <div>
              <h3>마음함</h3>
              {/* 마음함 목록 표사 */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}