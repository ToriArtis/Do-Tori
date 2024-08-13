import React, { useState, useEffect, useCallback } from 'react';
import { fetchPosts, fetchPopularPosts, likePost, bookmarkPost, fetchFollowingPosts, searchPosts, followUser, unfollowUser } from '../api/postApi';
import PostCreateBox from '../components/postCreateBox';
import PostItem from '../components/postItem';
import PopularPosts from '../components/popularPosts';
import Sidebar from '../../components/Sidebar';
import PostList from '../components/postList';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import './css/postListView.css';

export default function PostListView() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [viewMode, setViewMode] = useState('all'); // 'all' or 'following'

    const [followingUsers, setFollowingUsers] = useState([]);

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
          console.log('Search params:', { types: searchType, keyword: searchKeyword });
          const searchResults = await searchPosts(searchType === 'all' ? ['c', 'w', 't'] : [searchType], searchKeyword);
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
      }, [searchType, searchKeyword]);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        const userId = localStorage.getItem('USER_ID');
        const userNickName = localStorage.getItem('USER_NICKNAME');
        setCurrentUser(token ? { id: userId, nickName: userNickName } : null);
    
        loadPosts();
        loadPopularPosts();
    
        const intervalId = setInterval(() => {
          loadPopularPosts();
        }, 10000);
    
        return () => clearInterval(intervalId);
        fetchFollowingUsers().then(users => setFollowingUsers(users));
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

    const isFollowing = (userId) => {
        return followingUsers.some(user => user.userId === userId);
      };

    const handleToggleFollow = async (userId) => {
        try {
          if (isFollowing(userId)) {
            await unfollowUser(userId);
            setFollowingUsers(followingUsers.filter(user => user.userId !== userId));
          } else {
            await followUser(userId);
            const newFollowingUser = await getUserInfo(userId);
            setFollowingUsers([...followingUsers, newFollowingUser]);
          }
        } catch (error) {
          console.error('팔로우/언팔로우 처리 실패:', error);
          alert('서버 오류로 인해 팔로우/언팔로우 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      };

      return (
        <div className="post-list-view-container">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <div className="main-content">
                <div className="header">
                    <h1 className="page-title">To-rest</h1>
                    <Link href="/todo" className="go-dotori">
                        go Do-Tori →
                    </Link>
                </div>
                
                <PostCreateBox onPostCreated={loadPosts} />

                <div className="view-buttons">
                    <button 
                        onClick={() => setPostsView('all')} 
                        className={`view-button ${viewMode === 'all' ? 'active' : ''}`}
                    >
                        모든 글 보기
                    </button>
                    <button 
                        onClick={() => setPostsView('following')} 
                        className={`view-button ${viewMode === 'following' ? 'active' : ''}`}
                    >
                        팔로잉 게시글 모아보기
                    </button>
                </div>

                <PostList 
                    posts={posts}
                    onPostUpdated={onPostUpdated}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    onComment={handleComment}
                    currentUser={currentUser}
                    followingUsers={followingUsers}
                    onToggleFollow={handleToggleFollow}
                    isFollowing={isFollowing}
                />
            </div>
            <div className="side-content">
                <div className="search-container">
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="search-category"
                    >
                        <option value="">전체</option>
                        <option value="c">내용</option>
                        <option value="w">작성자</option>
                        <option value="t">태그</option>
                    </select>
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="검색"
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-button">
                        <SearchIcon />
                    </button>
                </div>
                <div className="hot-posts">
                    <h2 className="hot-posts-title">HOT 게시물</h2>
                    <PopularPosts posts={popularPosts} />
                </div>
            </div>
        </div>
    );
}