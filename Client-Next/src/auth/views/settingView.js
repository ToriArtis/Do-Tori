import React from 'react';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';
import useForm from '../hooks/useForm';
import "../components/css/setting.css";
import { isValidPassword } from '../models/auth';

export default function SettingView() {
  const { authInfo, error, isLoading, updateProfile } = useProfileViewModel();
  
  const { values, handleChange, setValues } = useForm({
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });


  if (isLoading) 
    return <div>Loading...</div>;

  if (error) 
    return <div>{error}</div>;

  if (!authInfo) 
    return <div>사용자 정보가 없습니다.</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updates = { phone: values.phone };
    
    if (values.newPassword) {
      // 비밀번호 유효성 검사
      if (!isValidPassword(values.newPassword)) {
        alert('비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
        return;
      }
      // 비밀번호 확인 검사
      if (values.newPassword !== values.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      updates.password = values.newPassword;
    }

    // 프로필 업데이트
    updateProfile(updates)
    window.location.reload();

  };

  return (
    <div className="setting-container">
      <h2>설정</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="tel"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          placeholder="전화번호"
        />

        <input
          type="password"
          name="newPassword"
          value={values.newPassword}
          onChange={handleChange}
          placeholder="새 비밀번호"
        />

        <input
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 확인"
        />

        <button type="submit" className="button">저장</button>
      </form>
    </div>
  );
}