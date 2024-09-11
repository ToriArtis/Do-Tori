import React, { useState, useEffect } from 'react';
import { toriBoxSelectAll, likePost, bookmarkPost, createComment } from '../api/postApi';
import PostList from '../components/postList';
import styled from 'styled-components';
import useInfoViewModel from '../../auth/viewmodels/useInfoViewModel';
import { useAuth } from '@/auth/hooks/useAuth';

const ToriboxContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;


const ToriboxView = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const posts = await toriBoxSelectAll();
      setLikedPosts(posts);
    } catch (error) {
      console.error('좋아요한 게시물을 불러오는데 실패했습니다:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchLikedPosts(); // 좋아요 후 목록 새로고침
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await bookmarkPost(postId);
      fetchLikedPosts(); // 북마크 후 목록 새로고침
    } catch (error) {
      console.error('북마크 처리 실패:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await createComment(postId, { content });
      fetchLikedPosts(); // 댓글 작성 후 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  return (
    <div className="toribox-container">
      <PostList 
        posts={likedPosts}
        onPostUpdated={fetchLikedPosts}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onComment={handleComment}
        currentUser={currentUser}
        hideFollowButton={true} // 여기서 팔로우 버튼을 숨깁니다
      />
    </div>
  );
};

export { ToriboxView }; 
export default ToriboxView;