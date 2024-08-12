import React, { useState, useRef, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../../config/app-config';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import usePostItem from '../hooks/usePostItem';
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
    console.log('Rendering images:', images);
    if (!images || images.length === 0) {
      console.log('No images to render');
      return null;
    }
    return images.map((image, index) => {
      const imageUrl = `${API_BASE_URL}/images/${encodeURIComponent(image.trim())}`;
      console.log(`Image ${index} URL:`, imageUrl);
  
      return (
        <div key={index} className="post-image-container">
          <img 
            className="post-image"
            src={imageUrl}
            alt={`Thumbnail ${index + 1}`} 
            onError={(e) => {
              e.target.src = placeholderImage;
            }}
          />
        </div>
      );
    });
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
    <div className="post-item-container">
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
            {postData.tags && postData.tags.length > 0 && (
            <div className="tag-container">
              {postData.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
            )}
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

        {currentUser && currentUser.id === postData.aid?.toString() && (
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>수정</MenuItem>
          <MenuItem onClick={handleDelete}>삭제</MenuItem>
        </Menu>
      </div>
      
      {isEditing ? (
        <div className="edit-form">
          <textarea
            className="edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <label className="image-label">
            🖼️ 이미지 추가
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="image-input"
            />
          </label>
          <div className="post-images">
            {renderImages(editImages)}
          </div>
          <input
            className="tag-input"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleAddTag}
            placeholder="태그 추가 (Enter로 추가)"
          />
          <div className="tag-list">
            {editTags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button className="delete-tag-button" onClick={() => handleDeleteTag(tag)}>
                  X
                </button>
              </span>
            ))}
          </div>
          <div className="edit-buttons">
            <button onClick={handleSaveEdit} className="save-button">저장</button>
            <button onClick={handleCancelEdit} className="cancel-button">취소</button>
          </div>
        </div>
      ) : (
        <>
          <p className="post-content">{postData?.content || ''}</p>
          {postData?.thumbnails && postData.thumbnails.length > 0 && (
            <div className="post-images">
              {renderImages(postData.thumbnails)}
            </div>
          )}
        </>
      )}
      
      <div className="post-actions">
        <button className="action-button" onClick={handleLike}>
          {postData.liked ? '❤️' : '🤍'} {postData.toriBoxCount || 0}
        </button>
        <button className="action-button" onClick={handleOpenDetailView}>
          💬 {postData.commentCount || 0}
        </button>
        <button className="action-button" onClick={handleBookmark}>
          {postData.bookmarked ? '🏷️' : '🔖'} {postData.bookmarkCount || 0}
        </button>
      </div>

      {isDetailView && (
        <div className="modal" onClick={handleCloseDetailView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseDetailView}>&times;</button>
            <h2>{postData.nickName}의 게시글</h2>
            <p>{postData.content}</p>
            {postData.thumbnails && postData.thumbnails.length > 0 && (
              <div className="post-images">
                {renderImages(postData.thumbnails)}
              </div>
            )}
            <div className="tag-list">
              {postData.tags && postData.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
            <div className="post-actions">
              <button className="action-button" onClick={handleLike}>
                {postData.liked ? '❤️' : '🤍'} {postData.toriBoxCount || 0}
              </button>
              <button className="action-button">
                💬 {postData.commentCount || 0}
              </button>
              <button className="action-button" onClick={handleBookmark}>
                {postData.bookmarked ? '🏷️' : '🔖'} {postData.bookmarkCount || 0}
              </button>
            </div>

            <div className="comment-section">
              <h3>댓글 ({totalComments})</h3>
              <form onSubmit={handleComment} className="comment-form">
                <textarea
                  className="comment-input"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                />
                <button type="submit" className="comment-button">댓글 작성</button>
              </form>
              <div className="comment-list">
                {renderComments(comments)}
              </div>
              {hasMore && (
                <button onClick={handleLoadMore} className="load-more-button">더보기</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}