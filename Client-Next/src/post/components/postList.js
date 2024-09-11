import React from 'react';
import PostItem from './postItem';
import './css/postList.css';

export default function PostList({ posts, onPostUpdated, onLike, onBookmark, onComment, onToggleFollow, isFollowing, currentUser, hideFollowButton, showEditDeleteMenu }) {
  return (
    <div>
      {/* 게시물 목록을 매핑하여 각 PostItem 컴포넌트 렌더링 */}
      {posts.map(post => (
        <PostItem 
          key={post.pid}  // 각 게시물의 고유 식별자
          post={post}  // 게시물 데이터
          onPostUpdated={onPostUpdated}  // 게시물 업데이트 콜백
          onLike={onLike}  // 좋아요 핸들러
          onBookmark={onBookmark}  // 북마크 핸들러
          onComment={onComment}  // 댓글 핸들러
          onToggleFollow={onToggleFollow}  // 팔로우/언팔로우 토글 핸들러
          isFollowing={isFollowing}  // 팔로우 상태
          currentUser={currentUser}
          hideFollowButton={hideFollowButton}
          showEditDeleteMenu={showEditDeleteMenu}
        />
      ))}
    </div>
  );
}