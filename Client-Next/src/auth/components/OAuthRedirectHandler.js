import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '@/config/app-config';
import OauthLoadingPage from '../views/OauthLoadingPage';

function OAuth2RedirectHandler() {
  const router = useRouter(); // 넥스트 라우터 훅
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 라우터가 준비되었는지 확인
    if (!router.isReady) return;

    const handleOAuthRedirect = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 쿼리 파라미터에서 code와 state를 추출
      const { code, state } = router.query;
       // 세션 스토리지에서 저장된 state와 provider 정보 가져옴
      const storedState = sessionStorage.getItem('oauth_state');
      const provider = sessionStorage.getItem('oauth_provider');

      if (state !== storedState) {
        setError('OAuth state mismatch. Please try logging in again.');
        setIsLoading(false);
        return;
      }

      // 사용이 끝난 세션 스토리지 항목들 제거
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_provider');

      try {
        const response = await fetch(`${API_BASE_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, provider }),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          if (data.accessToken) {
            localStorage.setItem('ACCESS_TOKEN', data.accessToken);
            localStorage.setItem('USER_NICKNAME', data.nickName);
            localStorage.setItem('USER_EMAIL', data.email);
            if(data.refreshToken) localStorage.setItem("REFRESH_TOKEN", data.refreshToken);
            if(data.provider) localStorage.setItem("PROVIDER", data.provider);
        
            router.push('/todo');
          } else {
            throw new Error('Token not received');
          }
        } else {
          const text = await response.text();
          throw new Error('Received non-JSON response from server');
        }
      } catch (error) {
        console.error('OAuth login error:', error);
        setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    handleOAuthRedirect();
  }, [router.isReady, router.query]);

  if (isLoading) {
    return <OauthLoadingPage />;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return null;
}

export default OAuth2RedirectHandler;