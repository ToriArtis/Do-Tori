import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { fetchPosts, fetchPopularPosts, likePost, bookmarkPost, fetchFollowingPosts, searchPosts } from '../api/postApi';
import PostCreateBox from '../components/postCreateBox';
import PostItem from '../components/postItem';
import PopularPosts from '../components/popularPosts';
import Sidebar from '../../components/Sidebar';
import PostList from '../components/postList';

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

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.active ? '#4CAF50' : '#ddd'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#ccc'};
  }
`;


export default function PostListView() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTypes, setSearchTypes] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'following'

    const loadPosts = useCallback(async () => {
        try {
            const fetchedPosts = viewMode === 'following'
                ? await fetchFollowingPosts()
                : await fetchPosts();
            setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : fetchedPosts.postLists || []);
        } catch (error) {
            console.error("게시물 로딩 중 오류 발생:", error);
        }
    }, [viewMode]);

    const loadPopularPosts = async () => {
        try {
            const fetchedPopularPosts = await fetchPopularPosts();
            setPopularPosts(fetchedPopularPosts || []);
        } catch (error) {
            console.error("인기 게시물 로딩 중 오류 발생:", error);
        }
    };

    const handleSearch = useCallback(async () => {
        try {
          console.log('Search params:', { types: searchTypes, keyword: searchKeyword });
          const searchResults = await searchPosts(searchTypes, searchKeyword);
          console.log('Search API response:', searchResults);
          const processedPosts = searchResults.content.map(post => ({
            ...post,
            thumbnails: post.thumbnail ? [post.thumbnail] : [],
            tags: post.tags || [],
            toriBoxCount: post.toriBoxCount || 0,
            commentCount: post.commentCount || 0,
            bookmarkCount: post.bookmarkCount || 0,
          }));
          setPosts(processedPosts);
        } catch (error) {
          console.error("게시물 검색 중 오류 발생:", error);
        }
      }, [searchTypes, searchKeyword]);

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
    }, [loadPosts]);

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
    }, [loadPosts]);

    const setPostsView = (mode) => {
        setViewMode(mode);
    };

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
                <ButtonContainer>
                    <Button 
                        onClick={() => setPostsView('all')} 
                        active={viewMode === 'all'}
                    >
                        모든 게시글 보기
                    </Button>
                    <Button 
                        onClick={() => setPostsView('following')} 
                        active={viewMode === 'following'}
                    >
                        팔로우한 사용자 게시글 보기
                    </Button>
                </ButtonContainer>
                <PostList 
                    posts={posts}
                    onPostUpdated={onPostUpdated}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onComment={handleComment}
                />
            </MainContent>
            <SideContent>
                <PopularPosts posts={popularPosts} />
            </SideContent>
        </PostListViewContainer>
    );
}