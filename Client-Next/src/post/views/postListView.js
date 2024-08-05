import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { fetchPosts, fetchPopularPosts, likePost, bookmarkPost, searchPosts } from '../api/postApi';
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
    const [searchTypes, setSearchTypes] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

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

    const handleSearch = async () => {
        try {
          const searchResults = await searchPosts(searchTypes, searchKeyword);
          setPosts(searchResults.content || []);
        } catch (error) {
          console.error("게시물 검색 중 오류 발생:", error);
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
            <div>
                <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
                />
                <select
                multiple
                value={searchTypes}
                onChange={(e) => setSearchTypes(Array.from(e.target.selectedOptions, option => option.value))}
                >
                <option value="c">내용</option>
                <option value="w">작성자</option>
                <option value="t">태그</option>
                </select>
                <button onClick={handleSearch}>검색</button>
            </div>
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