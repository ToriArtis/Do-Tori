import React, { useEffect } from 'react';
import { useSignUpViewModel } from '@/auth/viewmodels/useSignUpViewModel';
import "../components/css/signup.css";

function SignUpView() {
  const {
    values,
    handleChange,
    handleSubmit,
    error
  } = useSignUpViewModel();


  return (
    <div className="container">
      <div className="content">
        <div className="image-container">
          <img
            src="/tori.png" alt="tori" className="image" />
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            {error && <p className="error">{error}</p>}
            <div className="input-container">
              <label className="input-label">이메일</label>
              <input className="input-field" type="email" name="email"value={values.email} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label">비밀번호</label>
              <input className="input-field" type="password" name="password" value={values.password} onChange={handleChange} required/>
            </div>
            <div className="input-container">
              <label className="input-label">닉네임</label>
              <input className="input-field"
                type="text" name="nickName" value={values.nickName} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label">전화번호</label>
              <input className="input-field" type="tel"name="phone" value={values.phone} onChange={handleChange} required />
            </div>
            <div className="button-container">
              <button type="button" className="cancel-button" onClick={() => window.history.back()}>취소</button>
              <button type="submit" className="login-button">
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpView;

