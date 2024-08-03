import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchPosts, fetchPopularPosts, likePost, bookmarkPost } from '../api/postApi';
import PostCreateBox from '../components/postCreateBox';
import PostItem from '../components/PostItem';
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
        loadPosts();
        loadPopularPosts();
        // 현재 사용자 정보 가져오기
        const userEmail = localStorage.getItem('USER_EMAIL');
        setCurrentUser(userEmail ? { email: userEmail } : null);
    }, []);

        const handleLike = async (postId, isLiked) => {
        try {
            await likePost(postId);
            setPosts(posts.map(post => 
                post.pid === postId 
                    ? { ...post, liked: isLiked, toriBoxCount: post.toriBoxCount + (isLiked ? 1 : -1) }
                    : post
            ));
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    const handleBookmark = async (postId, isBookmarked) => {
        try {
            await bookmarkPost(postId);
            setPosts(posts.map(post => 
                post.pid === postId 
                    ? { ...post, bookmarked: isBookmarked, bookmarkCount: post.bookmarkCount + (isBookmarked ? 1 : -1) }
                    : post
            ));
        } catch (error) {
            console.error('북마크 처리 실패:', error);
        }
    };

    const handleComment = (postId, content) => {
        // 여기에 댓글 작성 API 호출 로직을 추가하세요
        console.log(`댓글 작성: 게시글 ID ${postId}, 내용: ${content}`);
    };

    return (
        <PostListViewContainer>
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <MainContent>
                {currentUser && <PostCreateBox onPostCreated={loadPosts} />}
                {posts.map((post) => (
                    <PostItem 
                        key={post.pid} 
                        post={post} 
                        isCurrentUser={currentUser && currentUser.email === post.email}
                        onPostUpdated={loadPosts}
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                        onComment={handleComment}
                    />
                ))}
            </MainContent>
            <SideContent>
                <PopularPosts posts={popularPosts} />
            </SideContent>
        </PostListViewContainer>
    );
}