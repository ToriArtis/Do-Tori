import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../components/ThemeContext';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-250px'};
  width: 250px;
  height: 100vh;
  background-color: ${props => props.isDarkMode ? '#1e1e1e' : '#f0f0f0'};
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
  color: inherit;
  text-decoration: none;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(10px);
    color: ${props => props.isDarkMode ? '#64ffda' : '#0070f3'};
  }
`;

const ToggleButton = styled.button`
  padding: 15px;
  background-color: ${props => props.isDarkMode ? '#64ffda' : '#0070f3'};
  color: ${props => props.isDarkMode ? '#000000' : '#ffffff'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  margin-bottom: 15%; // 메뉴 항목과의 간격 조정

  &:hover {
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
const Sidebar = ({ isOpen, onToggle }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <>
      <SidebarContainer isOpen={isOpen} isDarkMode={isDarkMode}>
        <SidebarContent>
          <MenuTitle>메뉴</MenuTitle>
          
          <Link href="/login" passHref>
            <StyledLink isDarkMode={isDarkMode}>Login</StyledLink>
          </Link>
          <Link href="/posts" passHref>
            <StyledLink isDarkMode={isDarkMode}>Posts</StyledLink>
          </Link>
          <Link href="/todo" passHref>
            <StyledLink isDarkMode={isDarkMode}>Todo</StyledLink>
          </Link>
          <Link href="/bookmark" passHref>
            <StyledLink isDarkMode={isDarkMode}>Bookmark</StyledLink>
          </Link>
          <Link href="/toribox" passHref>
            <StyledLink isDarkMode={isDarkMode}>Toribox</StyledLink>
          </Link>
          <Link href="/settings" passHref>
            <StyledLink isDarkMode={isDarkMode}>Settings</StyledLink>
          </Link>
          
          <ToggleButton onClick={toggleDarkMode} isDarkMode={isDarkMode}>
            {isDarkMode ? '라이트 모드' : '다크 모드'}로 전환
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