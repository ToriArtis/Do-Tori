import React, { useState } from 'react';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';
import useForm from '../hooks/useForm';
import "../components/css/profile.css";


export default function ProfileView() {
  const { authInfo, error, isLoading, updateProfile, updateProfileImage, updateHeaderImage } = useProfileViewModel();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { values, handleChange, setValues } = useForm({
    nickName: '',
    bio: ''
  });

  // authInfo가 업데이트될 때 폼 값 초기화
  React.useEffect(() => {
    if (authInfo) {
      setValues({
        nickName: authInfo.nickName || '',
        bio: authInfo.bio || ''
      });
    }
  }, [authInfo, setValues]);

  if (isLoading)
    return <div>Loading...</div>;

  if (error)
    return <div>{error}</div>;

  if (!authInfo)
    return <div>사용자 정보가 없습니다.</div>;

  // 프로필 수정, 모달 open
  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  // 프로필 저장
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(values);
    setIsModalOpen(false);
  };

  return (
    <div className="profile-container">
      <div className="header-image-container">
        {/* 헤더 이미지 */}
      </div>
      <div className="profile-info">
        <div className="profile-image-container">
          {/* 프로필 이미지 */}
        </div>
        
        <h2>{authInfo.nickName}</h2>
        <div className="follow-info">
          <span>10 팔로잉</span>
          <span>10 팔로워</span>
        </div>
        
        <p>{authInfo.bio || '자신을 소개해보세요'}</p>
        <button onClick={handleEditProfile} className="edit-button">프로필 수정</button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">X</button>
            <form onSubmit={handleSaveProfile}>
              <input
                type="text"
                name="nickName"
                value={values.nickName}
                onChange={handleChange}
                placeholder="닉네임"
              />
              <textarea
                name="bio"
                value={values.bio}
                onChange={handleChange}
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