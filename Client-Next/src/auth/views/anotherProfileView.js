import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserInfo } from '../api/authApi';
import { getFollowerCount, getFollowingCount, getFollowers, getFollowings } from '../api/followApi';
import { API_BASE_URL } from '@/config/app-config';
import "../components/css/profile.css";
import { ToriboxView } from '../../post/views/toriboxView';

export default function anotherProfileView() {
  // 라우터 및 URL 파라미터 가져오기
  const router = useRouter();
  const { userId } = router.query;

  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('');
  const [followList, setFollowList] = useState([]);
  const [followPage, setFollowPage] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
      fetchFollowCounts();
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      const info = await getUserInfo(userId);
      setUserInfo(info);
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const followers = await getFollowerCount(userId);
      const followings = await getFollowingCount(userId);
      setFollowerCount(followers);
      setFollowingCount(followings);
    } catch (error) {
      console.error('팔로우 수 가져오기 실패:', error);
    }
  };

  // 팔로우 목록
  const fetchFollowList = async (type) => {
    try {
      const response = type === 'followers'
        ? await getFollowers(userId, followPage)
        : await getFollowings(userId, followPage);

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

  // 탭 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
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
            <span style={{fontSize:"24px", fontWeight:"bold", paddingRight:"500px"}}>{userInfo.nickName}</span>
          </div>

          <div className="follow-info">
            <span onClick={() => openFollowModal('followings')}>{followingCount} 팔로잉</span>
            <span onClick={() => openFollowModal('followers')}>{followerCount} 팔로워</span>
          </div>

          <p style={{color:"grey", fontSize:"15px"}}>{userInfo.bio || ''}</p>
        </div>
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
                  <span onClick={() => router.push(`/profile/${user.userId}`)}>{user.nickName}</span>
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

      {/* 작성글/마음함 탭 */}
      <div className="tab-container">
        <div className="tab-menu">
          <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => handleTabChange('posts')}>
            작성글
          </button>
          <button className={activeTab === 'likes' ? 'active' : ''} onClick={() => handleTabChange('likes')}>
            마음함
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'posts' ? (
            <div>
              {/* 작성글 목록 표시 */}

            </div>
          ) : (
            <div>
              <ToriboxView userId={userId} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}