import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { updatePost, deletePost, likePost, bookmarkPost, createComment, fetchComments, deleteComment } from '../api/postApi';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../config/app-config';

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

const PostImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: calc(25% - 7.5px);
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
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
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
`;

const Tag = styled.span`
  background-color: #e0e0e0;
  padding: 2px 5px;
  border-radius: 3px;
`;

const DefaultAvatar = ({ size = 40, color = "#cccccc" }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill={color} />
    <circle cx="20" cy="15" r="7" fill="white" />
    <path d="M8 36C8 28.268 13.268 22 21 22C28.732 22 34 28.268 34 36" fill="white" />
  </svg>
);
// 1px 빈 이미지
const placeholderImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export default function PostItem({ post, isCurrentUser, onPostUpdated, onLike, onBookmark, onComment }) {
    // 상태 정의
    const [isDetailView, setIsDetailView] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [commentContent, setCommentContent] = useState('');
    const [editImages, setEditImages] = useState(post.thumbnails || []);
    const [editTags, setEditTags] = useState(post.tags || []);
    const [newTag, setNewTag] = useState('');
    const fileInputRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [currentUser, setCurrentUser] = useState(null);
    const [deletedThumbnails, setDeletedThumbnails] = useState([]);


    // 게시글 수정 핸들러
    const handleEdit = async (e) => {
      e.stopPropagation();
      if (isEditing) {
        try {
          const formData = new FormData();
          formData.append('postDTO', JSON.stringify({
            content: editContent,
            tags: editTags
          }));
          
          editImages.forEach((image, index) => {
            if (image instanceof File) {
              formData.append(`files`, image);
            } else if (typeof image === 'string') {
              formData.append('existingThumbnails', image);
            }
          });
    
          if (deletedThumbnails && deletedThumbnails.length > 0) {
            deletedThumbnails.forEach(thumbnail => 
              formData.append('deletedThumbnails', thumbnail)
            );
          }
    
          await updatePost(post.pid, formData);
          setIsEditing(false);
          onPostUpdated();
          alert('게시글이 성공적으로 수정되었습니다.');
        } catch (error) {
          console.error('게시글 수정 실패:', error);
          alert('게시글 수정에 실패했습니다: ' + error.message);
        }
      } else {
        setIsEditing(true);
      }
    };
    // 게시글 삭제 핸들러
    const handleDelete = async (e) => {
      e.stopPropagation();
      if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        try {
          await deletePost(post.pid);
          alert('게시글이 성공적으로 삭제되었습니다.');
          onPostUpdated();
        } catch (error) {
          console.error('게시글 삭제 실패:', error);
          alert('게시글 삭제에 실패했습니다.');
        }
      }
    };
    // 좋아요 핸들러
    const handleLike = async (e) => {
      e.stopPropagation();
      try {
        const result = await likePost(post.pid);
        onLike(post.pid, result);
      } catch (error) {
        console.error('좋아요 처리 실패:', error);
      }
    };
  
    // 북마크 핸들러
    const handleBookmark = async (e) => {
      e.stopPropagation();
      try {
        const result = await bookmarkPost(post.pid);
        onBookmark(post.pid, result);
      } catch (error) {
        console.error('북마크 처리 실패:', error);
      }
    };
  
    // 댓글 불러오기
    useEffect(() => {
      if (isDetailView) {
        loadComments(1);
      }
      const userEmail = localStorage.getItem('USER_EMAIL');
      const userNickName = localStorage.getItem('USER_NICKNAME');
      setCurrentUser(userEmail ? { email: userEmail, nickName: userNickName } : null);
    }, [isDetailView, post.pid]);
    
    // 댓글 로딩 함수
    const loadComments = async (page) => {
      try {
        const response = await fetchComments(post.pid, { page: page - 1, size: 10 });
        if (response && response.postLists) {
          setComments(response.postLists);
          setTotalPages(response.totalPages || 1);
          setCurrentPage(page);
        } else {
          console.error('Invalid comments response:', response);
        }
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
      }
    };
  
    // 댓글 작성 핸들러
    const handleComment = async (e, parentId = null) => {
      e.preventDefault();
      try {
        await createComment(post.pid, { content: commentContent, parentId });
        setCommentContent('');
        setReplyingTo(null);
        loadComments(currentPage);
      } catch (error) {
        console.error('댓글 작성 실패:', error);
        alert('댓글 작성에 실패했습니다.');
      }
    };
  
    // 답글 작성 핸들러
    const handleReply = (commentId) => {
      setReplyingTo(commentId);
    };
  
    // 날짜 포맷 함수
    const formatDate = (dateString) => {
      if (!dateString) return '날짜 없음';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '날짜 없음' : format(date, 'yyyy. MM. dd. HH:mm:ss');
    };
  
    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId) => {
      try {
        await deleteComment(commentId);
        alert('댓글이 삭제되었습니다.');
        loadComments(currentPage);
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    };
    // 댓글 렌더링 함수 (대댓글 포함)
    const renderComments = (commentList, parentId = null, depth = 0) => {
      return commentList
        .filter(comment => comment.parentId === parentId)
        .map(comment => (
          <CommentItem key={comment.id} isReply={depth > 0} style={{ marginLeft: `${depth * 20}px` }}>
            <CommentHeader>
              <CommentAuthor>{comment.nickName || '익명'}</CommentAuthor>
              <CommentDate>{formatDate(comment.regDate)}</CommentDate>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
            <CommentActions>
              {currentUser && (
                <DeleteButton onClick={() => handleDeleteComment(comment.id)}>삭제</DeleteButton>
              )}
              {depth < 2 && (
                <ReplyButton onClick={() => handleReply(comment.id)}>답글</ReplyButton>
              )}
            </CommentActions>
            {replyingTo === comment.id && (
              <ReplyForm>
                <CommentInput
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="답글을 입력하세요..."
                />
                <CommentButton onClick={(e) => handleComment(e, comment.id)}>답글 작성</CommentButton>
              </ReplyForm>
            )}
            {renderComments(commentList, comment.id, depth + 1)}
          </CommentItem>
        ));
    };
    
    // 이미지 업로드 핸들러
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length + editImages.length > 4) {
        alert('최대 4장의 이미지만 첨부할 수 있습니다.');
        return;
      }
      setEditImages(prevImages => [...prevImages, ...files]);
    };
    
    // 이미지 삭제 핸들러
    const handleDeleteImage = (index) => {
      const thumbnailToDelete = editImages[index];
      if (typeof thumbnailToDelete === 'string') {
        setDeletedThumbnails(prev => [...prev, thumbnailToDelete]);
      }
      setEditImages(prev => prev.filter((_, i) => i !== index));
    };

    // 태그 추가 핸들러
    const handleAddTag = (e) => {
      if (e.key === 'Enter' && newTag.trim() !== '') {
        setEditTags([...editTags, newTag.trim()]);
        setNewTag('');
      }
    };
  
    // 렌더링
    return (
      <PostItemContainer onClick={() => setIsDetailView(true)}>
        <PostHeader>
          <UserInfo>
            {post.profileImage ? (
              <Avatar src={post.profileImage} alt={post.nickName} />
            ) : (
              <DefaultAvatar />
            )}
            <div>
              <h3>{post.nickName}</h3>
              <p>{formatDate(post.regDate)}</p>
            </div>
          </UserInfo>
          {isCurrentUser && (
            <div>
              <EditButton onClick={handleEdit}>
                {isEditing ? '저장' : '수정'}
              </EditButton>
              <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
            </div>
          )}
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
            <PostContent>{post.content}</PostContent>
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
            <TagList>
              {post.tags && post.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagList>
          </>
        )}
        <PostActions>
          <ActionButton onClick={handleLike}>
            {post.liked ? '❤️' : '🤍'} {post.toriBoxCount}
          </ActionButton>
          <ActionButton>💬 {post.commentCount}</ActionButton>
          <ActionButton onClick={handleBookmark}>
            {post.bookmarked ? '🔖' : '🏷️'} {post.bookmarkCount}
          </ActionButton>
        </PostActions>
        {isDetailView && (
          <Modal onClick={() => setIsDetailView(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setIsDetailView(false)}>&times;</CloseButton>
              <h2>{post.nickName}의 게시글</h2>
              <p>{post.content}</p>
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
              <TagList>
                {post.tags && post.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagList>
              <PostActions>
                <ActionButton onClick={handleLike}>
                  {post.liked ? '❤️' : '🤍'} {post.toriBoxCount}
                </ActionButton>
                <ActionButton>💬 {post.commentCount}</ActionButton>
                <ActionButton onClick={handleBookmark}>
                  {post.bookmarked ? '🔖' : '🏷️'} {post.bookmarkCount}
                </ActionButton>
              </PostActions>
  
              <CommentSection>
                <h3>댓글</h3>
                <CommentInput
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                />
                <CommentButton onClick={(e) => handleComment(e)}>댓글 작성</CommentButton>
                <CommentList>
                  {renderComments(comments)}
                </CommentList>
                <PaginationContainer>
                  {[...Array(totalPages).keys()].map(number => (
                    <PageButton
                      key={number}
                      active={currentPage === number + 1}
                      onClick={() => loadComments(number + 1)}
                    >
                      {number + 1}
                    </PageButton>
                  ))}
                </PaginationContainer>
              </CommentSection>
            </ModalContent>
          </Modal>
        )}
      </PostItemContainer>
    );
  }