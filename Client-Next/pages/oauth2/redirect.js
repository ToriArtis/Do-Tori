import { useEffect } from 'react';
import { useRouter } from 'next/router';
import OAuth2RedirectHandler from '@/auth/components/OAuthRedirectHandler';

export default function OAuth2RedirectPage() {
  const router = useRouter();

  useEffect(() => {
     // router.isReady가 true가 되면(라우터가 완전히 초기화되면) 실행
     if (!router.isReady) return;
    if (router.isReady) {
        // OAuth2RedirectHandler 컴포넌트 로직 실행
    }
  }, [router.isReady]);

  return <OAuth2RedirectHandler />;
}