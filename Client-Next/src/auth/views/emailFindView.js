import React, { useEffect } from "react";
import { useEmailFindViewModel } from "../viewmodels/useEmailFindViewModel";
import "../components/css/emailfind.css";

function EmailFindView() {
  if(localStorage.getItem("ACCESS_TOKEN")) {
    window.location.href = "/";
  }
  
  const {
    phone,
    handleChange,
    handleSubmit,
    email,
  } = useEmailFindViewModel();

  useEffect(() => {
    if (email) {
      alert(`찾은 이메일: ${email}\n로그인 페이지로 이동합니다.`);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // 2초 후 로그인 페이지로 이동
    }
  }, [email]);

  return (
    <div className="container">
      <div className="content">
        <div className="image-container">
          <img src="/tori.png" alt="tori" className="image" />
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <h1 className="form-title">이메일 찾기</h1>
            <div className="input-container">
              <label className="input-label">전화번호</label>
              <input
                className="input-field"
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            {email && <p className="success">이메일을 찾았습니다. 곧 로그인 페이지로 이동합니다...</p>}
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

export default EmailFindView;