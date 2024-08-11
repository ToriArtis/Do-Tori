import React, { useState, useEffect } from 'react';
import { toriBoxSelectAll, likePost, bookmarkPost, createComment } from '../api/postApi';
import PostList from '../components/postList';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import useInfoViewModel from '../../auth/viewmodels/useInfoViewModel';

const ToriboxContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;


const ToriboxView = () => {
    const [likedPosts, setLikedPosts] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const userInfo = useInfoViewModel();  // useInfoViewModel 사용
    
    useEffect(() => {
        if (userInfo.id) {
          fetchLikedPosts();
        }
      }, [userInfo.id]);
  
      const fetchLikedPosts = async () => {
        try {
          const posts = await toriBoxSelectAll();
          console.log('Fetched liked posts:', posts);
          setLikedPosts(posts);
        } catch (error) {
          console.error('좋아요한 게시물을 불러오는데 실패했습니다:', error);
        }
      };
  
    const handlePostUpdated = () => {
      fetchLikedPosts();
    };
  
    const handleLike = async (postId) => {
      try {
        const result = await likePost(postId);
        setLikedPosts(prevPosts =>
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
        setLikedPosts(prevPosts =>
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
        fetchLikedPosts();
      } catch (error) {
        console.error('댓글 작성 실패:', error);
      }
    };
  
    return (
      <ToriboxContainer>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <PostList 
          posts={likedPosts}
          onPostUpdated={handlePostUpdated}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onComment={handleComment}
        />
      </ToriboxContainer>
    );
  };

export { ToriboxView }; 
export default ToriboxView;