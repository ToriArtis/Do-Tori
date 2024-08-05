import React, { useState } from 'react';
import useInfoViewModel from '../viewmodels/useInfoViewModel';
import { modify } from '../api/authApi';
import "../components/css/setting.css";

export default function SettingView() {
  // useInfoViewModel 사용자 정보 가져옴
  const userInfo = useInfoViewModel();
  
  const [editedPhone, setEditedPhone] = useState(userInfo.phone || '');
  const [editedPassword, setEditedPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (editedPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 전화번호와 비밀번호만 변경
      await modify({ phone: editedPhone, password: editedPassword });
      alert('변경사항이 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      setError('변경사항 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="setting-container">
      <h2>설정</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="tel" name="phone" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} placeholder="전화번호" />
        <input type="password"name="password" value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} placeholder="새 비밀번호"/>
        <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="비밀번호 확인"/>

        {error && <div className="error">{error}</div>}
        
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : '변경사항 저장'}
        </button>
      </form>
    </div>
  );
}