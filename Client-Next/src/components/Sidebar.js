import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../components/ThemeContext';
import { useRouter } from 'next/router';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-250px'};
  width: 250px;
  height: 100vh;
  background-color: ${props => props.isDarkMode ? '#4A463F' : '#CCBFB2'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  transition: all 0.2s ease-in-out;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const SidebarContent = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MenuTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  font-weight: 600;
`;

const StyledLink = styled.a`
  display: block;
  padding: 15px 0;
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  font-size: 18px;
  transition: all 0.2s ease;

  text-decoration: none;  
  &:hover {
    transform: translateX(10px);
    color: ${props => props.isDarkMode ? '#f5f5f5' : '#3f3f3f'};
    text-decoration: none;  
  }
`;


const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const LoginLogoutButton = styled(StyledLink)`
  margin-bottom: 20px;
  text-align: center;
  background-color: ${props => props.isDarkMode ? '#64ffda' : '#0070f3'};
  color: ${props => props.isDarkMode ? '#333333' : '#ffffff'};
  border-radius: 5px;
  padding: 10px 0;

  &:hover {
    transform: none;
    opacity: 0.9;
  }
`;

const SidebarToggle = styled.button`
  position: fixed;
  top: 50%;
  left: ${props => props.isOpen ? '250px' : '0'};
  transform: translateY(-50%);
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#f0f0f0'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  border: none;
  border-radius: ${props => props.isOpen ? '0 5px 5px 0' : '5px 0 0 5px'};
  width: 30px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background-color: ${props => props.isDarkMode ? '#2e2e2e' : '#e0e0e0'};
  }
`;

const ToggleImage = styled.img`
  width: 20px;
  height: 20px;
`;


const Sidebar = ({ isOpen, onToggle }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('ACCESS_TOKEN') || localStorage.getItem('REFRESH_TOKEN') === 'true') {
      setIsLogin(true);
    }

  }, []);

  const handleLoginLogout = () => {
    if (isLogin) {
      localStorage.setItem('isLoggedIn', 'false');
      setIsLogin(false);
      router.push('/');
    } else {
      // 로그인 페이지로 이동
      router.push('/login');
    }
  };
  const menuItems = [
    { href: '/profile', label: 'Profile' },
    { href: '/posts', label: 'Posts' },
    { href: '/todo', label: 'Todo' },
    { href: '/bookmark', label: 'Bookmark' },
    { href: '/setting', label: 'Settings' },
  ];

  
  return (
    <>
      <SidebarContainer isOpen={isOpen} isDarkMode={isDarkMode}>
        <SidebarContent>
          <MenuTitle><img src='/dotori.png' alt="Dotori" width="auto" /></MenuTitle>

          <StyledLink onClick={handleLoginLogout} isDarkMode={isDarkMode} isLoginButton>
            {isLogin ? 'Logout' : 'Login'}
          </StyledLink>

          {menuItems.map((item) => (
            router.pathname !== item.href && (
              <Link href={item.href} passHref key={item.href} style={{ textDecoration: 'none' }}>
                <StyledLink isDarkMode={isDarkMode}>{item.label}</StyledLink>
              </Link>
            )
          ))}
          
          <ToggleButton onClick={toggleDarkMode} isDarkMode={isDarkMode}>
            <ToggleImage
              src={isDarkMode ? '/moon.png' : '/moon.png'}
              alt={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            />
          </ToggleButton>
        </SidebarContent>
      </SidebarContainer>
      <SidebarToggle onClick={onToggle} isOpen={isOpen} isDarkMode={isDarkMode}>
        {isOpen ? '<' : '>'}
      </SidebarToggle>
    </>
  );
};

export default Sidebar;