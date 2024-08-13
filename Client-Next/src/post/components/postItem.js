import React, { useState, useRef, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../config/app-config';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import usePostItem from '../hooks/usePostItem';
import { useRouter } from 'next/router';
import './css/postItem.css';

// 기본 아바타 SVG 컴포넌트
const DefaultAvatar = ({ size = 40, color = "#cccccc" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill={color} />
    <circle cx="20" cy="15" r="7" fill="white" />
    <path d="M8 36C8 28.268 13.268 22 21 22C28.732 22 34 28.268 34 36" fill="white" />
  </svg>
);
// 1px 빈 이미지 (이미지 로드 실패 시 대체 이미지로 사용)
const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function PostItem({ post, onPostUpdated, isFollowing, onToggleFollow, currentUser: propsCurrentUser }) {
  const fileInputRef = useRef(null);
  const router = useRouter();

  const {
    isDetailView,
    setIsDetailView,
    isEditing,
    editContent,
    commentContent,
    replyContent,
    editImages,
    editTags,
    newTag,
    comments,
    replyingTo,
    currentUser: hookCurrentUser,
    anchorEl,
    totalComments,
    hasMore,
    postData,
    handleOpenDetailView,
    handleCloseDetailView,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleLike,
    handleBookmark,
    handleLoadMore,
    handleComment,
    handleReply,
    handleDeleteComment,
    handleImageUpload,
    handleDeleteImage,
    handleAddTag,
    handleDeleteTag,
    handleMenuOpen,
    handleMenuClose,
    setEditContent,
    setCommentContent,
    setReplyContent,
    setReplyingTo,
    setNewTag,
    formatDate,
    handleSearchResult
  } = usePostItem(post, onPostUpdated);

  const currentUser = propsCurrentUser || hookCurrentUser;

  const isCurrentUser = currentUser && postData.aid === currentUser.id;

  const handlePostClick = () => {
    router.push(`/post/${post.pid}`);
  };

  if (!postData) {
    return <div>로딩 중...</div>;
  }

useEffect(() => {
  console.log('postData:', postData);
  console.log('Updated postData:', postData);
  console.log('PostItem re-rendered with data:', postData);
  if (postData) {
    handleSearchResult(postData);
  }
}, [postData, handleSearchResult]);

  // 이미지 렌더링 함수
  const renderImages = useCallback((images) => {
    if (!images || images.length === 0) return null;
    return images.map((image, index) => (
      <div key={index} className="post-image-container">
        <img 
          className="post-image"
          src={`${API_BASE_URL}/images/${encodeURIComponent(image.trim())}`}
          alt={`Thumbnail ${index + 1}`} 
          onError={(e) => { e.target.src = placeholderImage; }}
        />
      </div>
    ));
  }, [API_BASE_URL]);

  // 댓글 렌더링 함수
  const renderComments = (commentList, parentId = null) => {
    if (!commentList || commentList.length === 0) {
      return null;
    }
    return commentList
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`comment-item ${parentId !== null ? 'reply' : ''}`}>
          <div className="comment-header">
            <span className="comment-author">{comment.nickName}</span>
            <span className="comment-date">{formatDate(comment.regDate)}</span>
          </div>
          <p className="comment-content">{comment.content}</p>
          <div className="comment-actions">
            {currentUser && postData && currentUser.id === postData.aid?.toString() && (
              <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            )}
            {!parentId && (
              <button className="reply-button" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                {replyingTo === comment.id ? '답글 취소' : '답글'}
              </button>
            )}
          </div>
          {replyingTo === comment.id && (
            <div className="reply-form">
              <textarea
                className="comment-input"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
              />
              <button className="comment-button" onClick={(e) => handleReply(e, comment.id)}>
                답글 작성
              </button>
            </div>
          )}
          {renderComments(commentList, comment.id)}
        </div>
      ));
  };

  // 렌더링
  return (
    <div className="post-item-container" onClick={handlePostClick}>
      <div className="post-header">
        <div className="user-info">
          {postData?.profileImage ? (
            <img className="avatar" src={postData.profileImage} alt={postData.nickName} />
          ) : (
            <DefaultAvatar />
          )}
          <div className='user-name-container'>
            <h3>{postData?.nickName}</h3>
            <p>{formatDate(postData?.regDate)}</p>
          </div>
        </div>
        {currentUser && !isCurrentUser && (
          <button onClick={(e) => {
            e.stopPropagation();
            onToggleFollow(postData.aid);
          }}>
            {isFollowing ? '팔로잉' : '팔로우'}
          </button>
        )}
      </div>
      
      <p className="post-content">{postData?.content || ''}</p>
      {postData?.thumbnails && postData.thumbnails.length > 0 && (
        <div className="post-images">
          {renderImages(postData.thumbnails)}
        </div>
      )}
      {postData.tags && postData.tags.length > 0 && (
        <div className="tag-container">
          {postData.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}
      
      <div className="post-actions">
        <button className="action-button" onClick={(e) => { e.stopPropagation(); handleLike(); }}>
          {postData.liked ? '❤️' : '🤍'} {postData.toriBoxCount || 0}
        </button>
        <button className="action-button" onClick={(e) => { e.stopPropagation(); }}>
          💬 {postData.commentCount || 0}
        </button>
        <button className="action-button" onClick={(e) => { e.stopPropagation(); handleBookmark(); }}>
          {postData.bookmarked ? '🏷️' : '🔖'} {postData.bookmarkCount || 0}
        </button>
      </div>
    </div>
  );
}