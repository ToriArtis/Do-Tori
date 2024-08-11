import React, { useState, useEffect } from 'react';
import { getBookmarkedPosts, likePost, bookmarkPost, createComment } from '../api/postApi';
import PostList from '../components/postList';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';

const BookmarksContainer = styled.div`
  width: 60%;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const BookmarkView = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchBookmarkedPosts();
  }, []);

  const fetchBookmarkedPosts = async () => {
    try {
      const posts = await getBookmarkedPosts();
      setBookmarkedPosts(posts);
    } catch (error) {
      console.error('북마크한 게시물을 불러오는데 실패했습니다:', error);
    }
  };

  const handlePostUpdated = () => {
    fetchBookmarkedPosts();
  };

  const handleLike = async (postId) => {
    try {
      const result = await likePost(postId);
      setBookmarkedPosts(prevPosts =>
        prevPosts.map(post =>
          post.pid === postId
            ? { ...post, liked: result.isLiked, toriBoxCount: result.likeCount }
            : post
        )
      );
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const result = await bookmarkPost(postId);
      setBookmarkedPosts(prevPosts =>
        prevPosts.map(post =>
          post.pid === postId
            ? { ...post, bookmarked: result.isBookmarked, bookmarkCount: result.bookmarkCount }
            : post
        )
      );
    } catch (error) {
      console.error('북마크 처리 실패:', error);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      await createComment(postId, { content });
      fetchBookmarkedPosts();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  return (
    <BookmarksContainer>
    <Sidebar 
            isOpen={isSidebarOpen} 
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
      <Title>북마크한 게시물</Title>
      <PostList 
        posts={bookmarkedPosts}
        onPostUpdated={handlePostUpdated}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onComment={handleComment}
      />
    </BookmarksContainer>
  );
};

export default BookmarkView;