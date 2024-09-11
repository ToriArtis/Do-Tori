import { useState, useEffect } from 'react';
import { getItem } from '@/auth/utils/storage';
import { info } from '@/auth/api/authApi';  // authApi에서 info 함수를 import

// 인증 관련 로직을 중앙화하는 커스텀 훅
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = getItem('ACCESS_TOKEN');
      const userId = getItem('USER_ID');
      const userNickName = getItem('USER_NICKNAME');

      if (token && userId) {
        // setCurrentUser({ id: userId, nickName: userNickName });
        setIsAuthenticated(true);
        try {
          // 서버에서 최신 사용자 정보 가져오기
          const userData = await info();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          // 서버에서 정보를 가져오는데 실패하면 로컬 스토리지의 정보 사용
          setCurrentUser({ id: userId, nickName: userNickName });
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };
    fetchUserInfo();
  }, []);

  return { currentUser, isAuthenticated };
};