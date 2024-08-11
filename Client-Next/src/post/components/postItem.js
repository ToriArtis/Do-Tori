import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { API_BASE_URL } from '../../config/app-config';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import usePostItem from '../hooks/usePostItem';

const PostItemContainer = styled.div`
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
  cursor: pointer;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const PostContent = styled.p`
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: 100%; // 부모 컨테이너의 전체 너비를 사용
  height: 400px; // 높이를 늘림 (필요에 따라 조정)
  object-fit: cover; // 이미지 비율을 유지하면서 컨테이너를 채움
  border-radius: 5px;
  margin-bottom: 10px; // 이미지 간 간격
`;

const PostImages = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); // 반응형 그리드 레이아웃
  gap: 10px;
  margin-bottom: 20px;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 14px;
  padding: 5px 10px;
  margin-right: 10px;
  &:hover {
    background-color: #f0f0f0;
    border-radius: 5px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const CommentButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const CommentItem = styled.div`
  margin-bottom: 10px;
  padding-left: ${props => props.isReply ? '20px' : '0'};
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  margin-left: 10px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
`;

const CommentDate = styled.span`
  font-size: 0.8em;
  color: #888;
`;

const CommentContent = styled.p`
  margin: 5px 0;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 5px;
`;

const ReplyForm = styled.div`
  margin-top: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: ${props => props.active ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const ImageInput = styled.input`
  display: none;
`;

const ImageLabel = styled.label`
  cursor: pointer;
  margin-right: 10px;
`;

const TagInput = styled.input`
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const DeleteTagButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background-color: #d32f2f;
  }
`;

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

export default function PostItem({ post, onPostUpdated }) {
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
    currentUser,
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

  const isCurrentUser = postData.aid === postData.currentUserAid;

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
        <div key={index}>
          <PostImage 
            src={imageUrl}
            alt={`Thumbnail ${index + 1}`} 
            onError={(e) => {
              console.error("Image load error for URL:", imageUrl);
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
        <CommentItem key={comment.id} isReply={parentId !== null}>
          <CommentHeader>
            <CommentAuthor>{comment.nickName}</CommentAuthor>
            <CommentDate>{formatDate(comment.regDate)}</CommentDate>
          </CommentHeader>
          <CommentContent>{comment.content}</CommentContent>
          <CommentActions>
            {currentUser && postData && currentUser.id === postData.aid?.toString() && (
              <DeleteButton onClick={() => handleDeleteComment(comment.id)}>삭제</DeleteButton>
            )}
            {!parentId && (
              <ReplyButton onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                {replyingTo === comment.id ? '답글 취소' : '답글'}
              </ReplyButton>
            )}
          </CommentActions>
          {replyingTo === comment.id && (
            <ReplyForm>
              <CommentInput
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
              />
              <CommentButton onClick={(e) => handleReply(e, comment.id)}>
                답글 작성
              </CommentButton>
            </ReplyForm>
          )}
          {renderComments(commentList, comment.id)}
        </CommentItem>
      ));
  };

  // 렌더링
  return (
    <PostItemContainer onClick={handleOpenDetailView}>
      <PostHeader>
        <UserInfo>
            {postData?.profileImage ? (
            <Avatar src={postData.profileImage} alt={postData.nickName} />
          ) : (
            <DefaultAvatar />
          )}
          <div>
            <h3>{postData?.nickName}</h3>
            <p>{formatDate(postData?.regDate)}</p>
          </div>
        </UserInfo>
      </PostHeader>
      {isEditing ? (
        <>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <ImageLabel onClick={(e) => e.stopPropagation()}>
            🖼️ 이미지 추가
            <ImageInput
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </ImageLabel>
          <PostImages>
            {renderImages(editImages)}
          </PostImages>
          <TagInput
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleAddTag}
            placeholder="태그 추가 (Enter로 추가)"
          />
          <TagList>
            {editTags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagList>
        </>
      ) : (
        <>
          <PostContent>{postData?.content || ''}</PostContent>
          {postData?.thumbnails && postData.thumbnails.length > 0 && (
            <PostImages>
              {renderImages(postData.thumbnails)}
            </PostImages>
          )}
          {postData.tags && postData.tags.length > 0 && (
            <TagContainer>
              {postData.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
          </TagContainer> 
          )}
        </>
    )}
      <PostActions>
        <ActionButton onClick={handleLike}>
          {postData.liked ? '❤️' : '🤍'} {postData.toriBoxCount || 0}
        </ActionButton>
        <ActionButton>💬 {postData.commentCount || 0}</ActionButton>
        <ActionButton onClick={handleBookmark}>
          {postData.bookmarked ? '🏷️' : '🔖'} {postData.bookmarkCount || 0}
        </ActionButton>
      </PostActions>
      {isDetailView && postData && (
        <Modal onClick={handleCloseDetailView}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseDetailView}>&times;</CloseButton>
            <h2>{postData.nickName}의 게시글</h2>
            {currentUser && currentUser.id === postData.aid?.toString() && (
              <div>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEdit}>수정</MenuItem>
                  <MenuItem onClick={handleDelete}>삭제</MenuItem>
                </Menu>
              </div>
            )}
            <p>{postData.content}</p>
            {postData.thumbnails && postData.thumbnails.length > 0 && (
            <PostImages>
              {renderImages(postData.thumbnails)}
            </PostImages>
          )}
          <TagList>
            {postData.tags && postData.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagList>
            <PostActions>
              <ActionButton onClick={handleLike}>
                {postData.liked ? '❤️' : '🤍'} {postData.toriBoxCount || 0}
              </ActionButton>
              <ActionButton>💬 {postData.commentCount || 0}</ActionButton>
              <ActionButton onClick={handleBookmark}>
                {postData.bookmarked ? '🏷️' : '🔖'} {postData.bookmarkCount || 0}
              </ActionButton>
            </PostActions>

            {/* 댓글 섹션 */}
            <CommentSection>
              <h3>댓글 ({totalComments})</h3>
              <form onSubmit={handleComment}>
                <CommentInput
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                />
                <CommentButton type="submit">댓글 작성</CommentButton>
              </form>
              <CommentList>
                {renderComments(comments)}
              </CommentList>
              {hasMore && (
                <button onClick={handleLoadMore}>더보기</button>
              )}
            </CommentSection>
          </ModalContent>
        </Modal>
      )}
      {isEditing && (
        <Modal onClick={handleCancelEdit}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCancelEdit}>&times;</CloseButton>
            <h2>게시글 수정</h2>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <ImageLabel>
              🖼️ 이미지 추가
              <ImageInput
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </ImageLabel>
            <PostImages>
              {editImages.map((image, index) => (
                <div key={index}>
                  <PostImage
                    src={image instanceof File ? URL.createObjectURL(image) : `${API_BASE_URL}/api/images/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    onError={(e) => {
                      console.error("Image load error:", e);
                      e.target.src = placeholderImage;
                    }}
                  />
                  <button onClick={() => handleDeleteImage(index)}>삭제</button>
                </div>
              ))}
            </PostImages>
            <TagContainer>
              {editTags.map((tag, index) => (
                <React.Fragment key={index}>
                  <Tag>{tag}</Tag>
                  <DeleteTagButton onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag);
                  }}>
                    X
                  </DeleteTagButton>
                </React.Fragment>
              ))}
            </TagContainer>
            <TagInput
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleAddTag}
              placeholder="새 태그 추가 (Enter로 추가)"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={handleSaveEdit}>저장</button>
            <button onClick={handleCancelEdit}>취소</button>
          </ModalContent>
        </Modal>
      )}
    </PostItemContainer>
  );
}