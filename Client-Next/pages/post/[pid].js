import { useRouter } from 'next/router';
import PostDetailPage from '../../src/post/components/postDetailPage';

export default function PostPage() {
  const router = useRouter();
  const { pid } = router.query;

  if (!pid) {
    return <div>Loading...</div>;
  }

  return <PostDetailPage postId={pid} />;
}