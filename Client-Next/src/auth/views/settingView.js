import React, { useState } from 'react';
import useInfoViewModel from '../viewmodels/useInfoViewModel';
import { modify } from '../api/authApi';
import "../components/css/setting.css";
import Sidebar from '@/components/Sidebar';

export default function SettingView() {
  const userInfo = useInfoViewModel();

  const [editedPhone, setEditedPhone] = useState(userInfo.phone || '');
  const [editedPassword, setEditedPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editedPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 전화번호 비밀번호만 변경
      await modify({ phone: editedPhone, password: editedPassword });
      alert('변경사항이 저장되었습니다.');
      window.location.reload();
    } catch (error) {
      alert('변경사항 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="setting-container">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <h2 className="title">회원정보 수정</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="phone">전화번호</label>
          <input
            type="tel"
            id="phone"
            value={editedPhone}
            onChange={(e) => setEditedPhone(e.target.value)}
            className="underline-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
            className="underline-input"
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="underline-input"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            수정
          </button>
          <button type="button" className="cancel-button">
            회원탈퇴
          </button>
        </div>
      </form>
    </div>
  );
}