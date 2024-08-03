import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';  // Next.js의 Link 컴포넌트 사용
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const SidebarContainer = styled.div`
  width: ${({ isOpen }) => (isOpen ? '250px' : '50px')};
  height: 100vh;
  background-color: var(--color-linen);
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s ease-in-out;
  overflow-x: hidden;
  z-index: 1000;
`;

const ToggleButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 50px;
`;

const StyledLink = styled.a`
  color: var(--color-gray-100);
  text-decoration: none;
  padding: 10px 0;
  font-size: 18px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const ModeToggle = styled(Button)`
  margin-top: 20px;
`;

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <ToggleButton onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </ToggleButton>
      <NavLinks>
        <Link href="/login" passHref>
          <StyledLink isOpen={isOpen}>Login</StyledLink>
        </Link>
        <Link href="/posts" passHref>
          <StyledLink isOpen={isOpen}>Posts</StyledLink>
        </Link>
        <Link href="/todo" passHref>
          <StyledLink isOpen={isOpen}>Todo</StyledLink>
        </Link>
        <Link href="/bookmark" passHref>
          <StyledLink isOpen={isOpen}>Bookmark</StyledLink>
        </Link>
        <Link href="/settings" passHref>
          <StyledLink isOpen={isOpen}>Settings</StyledLink>
        </Link>
        <ModeToggle onClick={toggleDarkMode} isOpen={isOpen}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </ModeToggle>
      </NavLinks>
    </SidebarContainer>
  );
};

export default Sidebar;