import React, { useState } from "react";
import { Container, Typography, Grid, Link, Button } from '@mui/material';
import "../components/css/auth.css";
import { useLoginViewModel } from "../viewmodels/useLoginViewModel";
import { googleKey, naverKey, kakaoKey, redirectUri } from "../../Config";

function LoginView() {

  const {
    email,
    password,
    handleChange,
    handleSubmit,
  } = useLoginViewModel();


const handleSocialLogin = (provider) => {
  const state = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_provider', provider);

  let authUrl;
  switch(provider) {
    case 'google':
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&state=${state}`;
      break;
    case 'naver':
      authUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
      break;
    case 'kakao':
      authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`;
      break;
    default:
      return;
    }
    window.location.href = authUrl;
  };


  return (
    <div className="container">
      <div className="content">
        <div className="image-container">
          <img src="/tori.png" alt="tori" className="image" />
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <div className="input-label">아이디</div>
              <input
                className="input-field"
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <div className="input-label">비밀번호</div>
              <input
                className="input-field"
                type="password"
                id="password"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            <div className="find-account">
              <Link href="/emailfind">아이디</Link> | <Link href="/passwordfind">비밀번호 찾기</Link>
            </div>

            <div className="hr-sect">소셜 계정 로그인</div>
            <div className="social-buttons">
              {['google', 'naver', 'kakao'].map((provider) => (
                <button 
                  key={provider} 
                  className={`social-button ${provider}`}
                  onClick={() => handleSocialLogin(provider)}
                >
                  <img src={`/${provider}.png`} alt={`${provider} login`} />
                </button>
              ))}
            </div>
            <div className="action-buttons">
              <button type="submit" className="action-button login-button">로그인</button>
              <a href="/signup" className="action-button signup-button">회원가입</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginView;