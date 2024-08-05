import React from "react";
import { usePasswordFindViewModel } from "../viewmodels/usePasswordFindViewModel";
import "../components/css/passwordfind.css";

function PassWordFindView() {
  if(localStorage.getItem("ACCESS_TOKEN") ) {
    window.location.href = "/";
  }
  
  const {
    email,
    password,
    passwordCheck,
    handleChange,
    handleSubmit,
    error,
  } = usePasswordFindViewModel();

  return (
    <div className="container">
      <div className="content">
        <div className="image-container">
          <img src="/tori.png" alt="tori" className="image" />
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <h1 className="form-title">비밀번호 찾기</h1>
            {error && <p className="error">{error}</p>}
            <div className="input-container">
              <label className="input-label">이메일</label>
              <input
                className="input-field"
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label className="input-label">새 비밀번호</label>
              <input
                className="input-field"
                type="password"
                id="password"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label className="input-label">비밀번호 확인</label>
              <input
                className="input-field"
                type="password"
                id="passwordCheck"
                value={passwordCheck}
                onChange={(e) => handleChange('passwordCheck', e.target.value)}
                required
              />
            </div>
            <div className="button-container">
              <button type="button" className="cancel-button" onClick={() => window.history.back()}>취소</button>
              <button type="submit" className="confirm-button">확인</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PassWordFindView;