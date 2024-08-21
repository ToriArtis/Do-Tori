import React, { useEffect, useState } from 'react';
import useInfoViewModel from '../viewmodels/useInfoViewModel';
import { modify, uploadProfileImage, uploadHeaderImage } from '../api/authApi';
import "../components/css/profile.css";
import { getFollowerCount, getFollowingCount, getFollowers, getFollowings } from '../api/followApi';
import { API_BASE_URL } from '@/config/app-config';
import { ToriboxView } from '../../post/views/toriboxView';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { AuthPostListView } from '../../post/views/authPostListView';

export default function ProfileView() {
  const userInfo = useInfoViewModel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedNickName, setEditedNickName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newHeaderImage, setNewHeaderImage] = useState(null);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('');
  const [followList, setFollowList] = useState([]);
  const [followPage, setFollowPage] = useState(0);
  const router = useRouter(); // 라우터 초기화

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 사용자 프로필 이동
  const navigateToUserProfile = (userId) => {
    router.push(`/profile/${userId}`);
  };


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

  // 팔로우 목록
  const fetchFollowList = async (type) => {
    try {
      // 팔로워 또는 팔로잉 목록을 가져옴
      const response = type === 'followers'
        ? await getFollowers(userInfo.id, followPage)
        : await getFollowings(userInfo.id, followPage);

      setFollowList(prev => [...prev, ...response.content]);
      if (response.last) {
        setFollowPage(-1);
      } else {
        setFollowPage(prev => prev + 1);
      }
    } catch (error) {
      console.error(`${type} 목록 가져오기 실패:`, error);
    }
  };

  // 팔로우 모달
  const openFollowModal = (type) => {
    setFollowModalType(type);
    setFollowList([]);
    setFollowPage(0);
    setShowFollowModal(true);
    fetchFollowList(type);
  };

  const closeFollowModal = () => {
    setShowFollowModal(false);
    setFollowModalType('');
    setFollowList([]);
    setFollowPage(0);
  };

  // 모달창
  const handleEditProfile = () => {
    setEditedNickName(userInfo.nickName);
    setEditedBio(userInfo.bio);
    setIsModalOpen(true);
  };

  //프로필 변경 이벤트 핸들러
  const handleProfileImageChange = (e) => {
    // e.target.files[0]: 선택된 첫 번째 파일
    setNewProfileImage(e.target.files[0]);
  };

  const handleHeaderImageChange = (e) => {
    setNewHeaderImage(e.target.files[0]);
  };

  // 프로필 저장
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // 닉네임/bio 업데이트
      await modify({ nickName: editedNickName, bio: editedBio });

      // 프로필 이미지 업데이트
      if (newProfileImage) {
        await uploadProfileImage(newProfileImage);
      }

      // 헤더 이미지 업데이트
      if (newHeaderImage) {
        await uploadHeaderImage(newHeaderImage);
      }

      setIsModalOpen(false);
      window.location.reload();
      alert("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      alert(`프로필 업데이트에 실패했습니다: ${error.message}`);
    }
  };

  // 탭 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="profile-container">
        <div className="header-image-container">
          {userInfo.headerImage ? (
            <img src={`${API_BASE_URL}/auth/images/${userInfo.headerImage}`} alt="Header" />
          ) : (
            <div className="default-header"></div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-image-container">
            {userInfo.profileImage ? (
              <img src={`${API_BASE_URL}/auth/images/${userInfo.profileImage}`} alt="Profile" />
            ) : (
              <div className="default-profile"></div>
            )}
          </div>

          <div className="nickname-info">
            <span style={{ fontSize: "24px", fontWeight: "bold", paddingRight: "500px" }}>{userInfo.nickName} </span>
            <span><button onClick={handleEditProfile} className="edit-button">프로필 수정</button></span>
          </div>

          <div className="follow-info">
            <span onClick={() => openFollowModal('followings')}>{followingCount} 팔로잉</span>
            <span onClick={() => openFollowModal('followers')}>{followerCount} 팔로워</span>
          </div>

          <p style={{ color: "grey", fontSize: "15px" }}>{userInfo.bio || '자신을 소개해보세요'}</p>

        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">X</button>
              <form onSubmit={handleSaveProfile}>
                <div>
                  <label>프로필 이미지:</label>
                  <input type="file" onChange={handleProfileImageChange} accept="image/*" />
                </div>
                <div>
                  <label>헤더 이미지:</label>
                  <input type="file" onChange={handleHeaderImageChange} accept="image/*" />
                </div>
                <input
                  type="text" value={editedNickName} onChange={(e) => setEditedNickName(e.target.value)} placeholder="닉네임" />
                <textarea
                  value={editedBio} onChange={(e) => setEditedBio(e.target.value)} placeholder="자신을 소개해보세요" />
                <button type="submit">저장</button>
              </form>
            </div>
          </div>
        )}
      </div>

      {showFollowModal && (
        <div className="modal-overlay">
          <div className="modal-content follow-modal">
            <button onClick={closeFollowModal} className="modal-close-btn">X</button>
            <h3>{followModalType === 'followers' ? '팔로워' : '팔로잉'} 목록</h3>
            <div className="follow-list">
              {followList.map((user, index) => (
                <div key={index} className="follow-item">
                  <img
                    src={`${API_BASE_URL}/auth/images/${user.profileImage}`}
                    alt={user.nickName}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-profile.png"; }}
                  />
                  {/* 닉네임 클릭 시 해당 사용자의 프로필로 이동 */}
                  <span onClick={() => navigateToUserProfile(user.userId)}>{user.nickName}</span>
                </div>
              ))}
            </div>
            {followPage !== -1 && (
              <button onClick={() => fetchFollowList(followModalType)} className="load-more-btn">
                더 보기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 작성글/마음함 tab */}
      <div className="tab-container">
        <div className="tab-menu">
          <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => handleTabChange('posts')}>
            작성글 관리
          </button>
          <button className={activeTab === 'likes' ? 'active' : ''} onClick={() => handleTabChange('likes')}>
            마음함
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'posts' ? (
            <div>
              <AuthPostListView />

            </div>
          ) : (
            <div>
              <ToriboxView />
            </div>
          )}
        </div>
      </div>
    </>
  );
}