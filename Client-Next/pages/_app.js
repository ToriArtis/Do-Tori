// pages/_app.js
import { ThemeProvider, useTheme } from '../src/components/ThemeContext';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.isDarkMode ? '#121212' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

function AppContent({ Component, pageProps }) {
  const { isDarkMode, isMounted } = useTheme();

  if (!isMounted) {
    return null; // 또는 로딩 인디케이터를 반환
  }

  return (
    <>
      <GlobalStyle isDarkMode={isDarkMode} />
      <Component {...pageProps} />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;