import React, { useState, useEffect } from 'react';
import { authPostListView, likePost, bookmarkPost, createComment } from '../api/postApi';
import PostList from '../components/postList';
import styled from 'styled-components';
import useInfoViewModel from '../../auth/viewmodels/useInfoViewModel';

const UserPostsContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px;
`;


const AuthPostListView = () => {
    const [userPosts, setUserPost] = useState([]);
    const userInfo = useInfoViewModel();  
    
    useEffect(() => {
        if (userInfo.id) {
          fetchUserPosts();
        }
      }, [userInfo.id]);
  

      const fetchUserPosts = async () => {
        try {
          // 해당 부분 수정하기
          const posts = await authPostListView(); 

          console.log('Fetched liked posts:', posts);

          setUserPost(posts);

        } catch (error) {
          console.error('유저 게시물을 불러오는데 실패했습니다:', error);

        }
      };
  
    const handlePostUpdated = () => {
      fetchLikedPosts();
    };
  
    const handleLike = async (postId) => {
      try {
        const result = await likePost(postId);
        setUserPost(prevPosts =>
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
        setUserPost(prevPosts =>
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
      <UserPostsContainer>
        <PostList 
          posts={userPosts}
          onPostUpdated={handlePostUpdated}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onComment={handleComment}
        />
      </UserPostsContainer>
    );
  };

export { AuthPostListView }; 
export default AuthPostListView;