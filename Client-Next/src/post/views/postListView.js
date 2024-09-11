import React, { useState, useEffect, useCallback } from 'react';
import { fetchPosts, fetchPopularPosts, fetchFollowingPosts, searchPosts, followUser, unfollowUser, fetchFollowingUsers } from '../api/postApi';
import PostCreateBox from '../components/postCreateBox';
import PostList from '../components/postList';
import PopularPosts from '../components/popularPosts';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import SearchComponent from '../components/searchComponent';
import { usePostActions } from '../hooks/usePostActions';
import { useAuth } from '../../auth/hooks/useAuth';
import { format } from 'date-fns';
import './css/postListView.css';

export default function PostListView() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchType, setSearchType] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [viewMode, setViewMode] = useState('all');
    const [followingUsers, setFollowingUsers] = useState([]);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const { handleLike, handleBookmark, handleComment, error } = usePostActions();
    const { currentUser, isAuthenticated } = useAuth();

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
            const searchResults = await searchPosts(searchType === 'all' ? ['c', 'w', 't'] : [searchType], searchKeyword);
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
        const loadFollowingUsers = async () => {
            if (isAuthenticated) {
                try {
                    const users = await fetchFollowingUsers();
                    setFollowingUsers(users);
                } catch (error) {
                    console.error('팔로잉 목록 로드 실패:', error);
                }
            }
        };
        loadFollowingUsers();
    }, [isAuthenticated]);

    useEffect(() => {
        loadPosts();
        loadPopularPosts();

        const intervalId = setInterval(() => {
            loadPopularPosts();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [loadPosts]);

    const onPostUpdated = useCallback(() => {
        loadPosts();
    }, [loadPosts]);

    const setPostsView = (mode) => {
        setViewMode(mode);
    };

    const isFollowing = useCallback((userId) => {
        return followingUsers.some(user => user.userId.toString() === userId.toString());
    }, [followingUsers]);

    const handleToggleFollow = async (userId) => {
        if (!isAuthenticated) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (currentUser.id.toString() === userId.toString()) {
            alert("자기 자신을 팔로우/언팔로우할 수 없습니다.");
            return;
        }
        try {
            const isCurrentlyFollowing = isFollowing(userId);
            let result;
            if (isCurrentlyFollowing) {
                result = await unfollowUser(userId);
            } else {
                result = await followUser(userId);
            }
            
            if (result.success) {
                setFollowingUsers(prev => 
                    isCurrentlyFollowing
                        ? prev.filter(user => user.userId.toString() !== userId.toString())
                        : [...prev, { userId: userId.toString() }]
                );
                
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.aid.toString() === userId.toString()
                            ? { ...post, isFollowing: !isCurrentlyFollowing } 
                            : post
                    )
                );
                
                console.log(isCurrentlyFollowing ? '언팔로우 성공' : '팔로우 성공');
            } else {
                throw new Error(isCurrentlyFollowing ? '언팔로우 처리에 실패했습니다.' : '팔로우 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('팔로우/언팔로우 처리 실패:', error);
            alert(`팔로우/언팔로우 처리에 실패했습니다: ${error.message}`);
        }
    };
    

    const formatDate = (dateString) => {
        if (!dateString) return '날짜 없음';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '날짜 없음' : format(date, 'yyyy. MM. dd. HH:mm:ss');
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
                
                {isAuthenticated && <PostCreateBox onPostCreated={loadPosts} />}

                <div className="view-buttons">
                    <button 
                        onClick={() => setPostsView('all')} 
                        className={`view-button ${viewMode === 'all' ? 'active' : ''}`}
                    >
                        모든 글 보기
                    </button>
                    {isAuthenticated && (
                        <button 
                            onClick={() => setPostsView('following')} 
                            className={`view-button ${viewMode === 'following' ? 'active' : ''}`}
                        >
                            팔로잉 게시글 모아보기
                        </button>
                    )}
                </div>

                <PostList 
                posts={posts}
                onPostUpdated={onPostUpdated}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onComment={handleComment}
                currentUser={currentUser}
                onToggleFollow={handleToggleFollow}
                isFollowing={isFollowing}
                formatDate={formatDate}
                renderPostHeader={(post) => (
                    <PostHeader 
                        key={`${post.pid}-${isFollowing(post.aid)}`}
                        post={post}
                        currentUser={currentUser}
                        onToggleFollow={handleToggleFollow}
                        isFollowing={isFollowing(post.aid)}
                        showEditDeleteButtons={true}
                        onMenuOpen={(e) => setAnchorEl(e.currentTarget)}
                        anchorEl={anchorEl}
                        onMenuClose={() => setAnchorEl(null)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            />
            </div>
            <div className="side-content">
                <SearchComponent 
                    searchType={searchType}
                    setSearchType={setSearchType}
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    handleSearch={handleSearch}
                />
                <div className="hot-posts">
                    <h2 className="hot-posts-title">HOT 게시물</h2>
                    <PopularPosts posts={popularPosts} />
                </div>
            </div>
        </div>
    );
}