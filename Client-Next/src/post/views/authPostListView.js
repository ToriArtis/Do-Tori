import React, { useState, useEffect } from 'react';
import { fetchUserPosts, likePost, bookmarkPost, createComment } from '../api/postApi';
import PostList from '../components/postList';
import styled from 'styled-components';
import useInfoViewModel from '../../auth/viewmodels/useInfoViewModel';
import { useAuth } from '@/auth/hooks/useAuth';

const UserPostsContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;


const AuthPostListView = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchUserPostsData();
    }
  }, [currentUser]);

  const fetchUserPostsData = async () => {
    try {
      const posts = await fetchUserPosts();
      setUserPosts(posts);
    } catch (error) {
      console.error('사용자 게시물을 불러오는데 실패했습니다:', error);
      setUserPosts([]);
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      fetchUserPosts(); // 좋아요 후 목록 새로고침
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await bookmarkPost(postId);
      fetchUserPosts(); // 북마크 후 목록 새로고침
    } catch (error) {
      console.error('북마크 처리 실패:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await createComment(postId, { content });
      fetchUserPosts(); // 댓글 작성 후 목록 새로고침
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  return (
    <div className="auth-post-list-container">
      <PostList 
        posts={userPosts}
        onPostUpdated={fetchUserPostsData}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onComment={handleComment}
        currentUser={currentUser}
        showEditDeleteMenu={true}
      />
    </div>
  );
};

export { AuthPostListView }; 
export default AuthPostListView;