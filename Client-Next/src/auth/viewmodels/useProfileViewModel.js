import { useState, useEffect } from 'react';
import { info, modify } from '../api/authApi';

export function useProfileViewModel() {
  const [authInfo, setAuthInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAuthInfo();
  }, []);

  // 사용자 정보 가져옴
  const fetchAuthInfo = async () => {
    try {
      const data = await info();
      setAuthInfo(data);
    } catch (err) {
      setError('Failed to fetch user information');
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 프로필 업데이트
  const updateProfile = async (updatedInfo) => {
    try {
      const updatedAuth = { ...authInfo, ...updatedInfo };
      await modify(updatedAuth);
      setAuthInfo(updatedAuth);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return {
    authInfo,
    error,
    isLoading,
    updateProfile,
  };
}