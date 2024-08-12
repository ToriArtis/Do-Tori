import React from 'react';

import { useRouter } from 'next/router';
import AnotherProfileView from '@/auth/views/anotherProfileView';


const ProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;

  return <AnotherProfileView userId={userId} />;
};

export default ProfilePage;