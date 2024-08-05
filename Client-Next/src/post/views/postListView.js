import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { fetchPosts, fetchPopularPosts, likePost, bookmarkPost } from '../api/postApi';
import PostCreateBox from '../components/postCreateBox';
import PostItem from '../components/postItem';
import PopularPosts from '../components/popularPosts';
import Sidebar from '../../components/Sidebar';

const PostListViewContainer = styled.div`
  display: flex;
  width: 60%;
  padding: 20px;
  gap: 20px;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
`;

const SideContent = styled.div`
  width: 200px;
  margin-right: 20px;
`;


export default function PostListView() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const loadPosts = async () => {
        try {
            const fetchedPosts = await fetchPosts();
            setPosts(fetchedPosts.postLists || []);
        } catch (error) {
            console.error("게시물 로딩 중 오류 발생:", error);
        }
    };

    const loadPopularPosts = async () => {
        try {
            const fetchedPopularPosts = await fetchPopularPosts();
            setPopularPosts(fetchedPopularPosts || []);
        } catch (error) {
            console.error("인기 게시물 로딩 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('USER_ID');
        const userNickName = localStorage.getItem('USER_NICKNAME');
        setCurrentUser(userId ? { id: userId, nickName: userNickName } : null);
    
        loadPosts();
        loadPopularPosts();
    
        const intervalId = setInterval(() => {
          loadPopularPosts();
        }, 10000);
    
        return () => clearInterval(intervalId);
      }, []);

    const handleLike = async (postId, isLiked, likeCount) => {
        setPosts(posts.map(post => 
            post.pid === postId 
                ? { ...post, liked: isLiked, toriBoxCount: likeCount }
                : post
        ));
    };

    const handleBookmark = async (postId, isBookmarked, bookmarkCount) => {
        setPosts(posts.map(post => 
            post.pid === postId 
                ? { ...post, bookmarked: isBookmarked, bookmarkCount: bookmarkCount }
                : post
        ));
    };

    const handleComment = (postId, content) => {
        // 여기에 댓글 작성 API 호출 로직을 추가하세요
        console.log(`댓글 작성: 게시글 ID ${postId}, 내용: ${content}`);
    };

    const onPostUpdated = useCallback(() => {
        loadPosts();
      }, []);

    return (
        <PostListViewContainer>
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <MainContent>
                <PostCreateBox onPostCreated={loadPosts} />
                {posts.map((post) => (
                    <PostItem 
                        key={post.pid} 
                        post={post} 
                        onPostUpdated={onPostUpdated}
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                        onComment={handleComment}
                        currentUser={currentUser}
                    />
                ))}
            </MainContent>
            <SideContent>
                <PopularPosts posts={popularPosts} />
            </SideContent>
        </PostListViewContainer>
    );
}