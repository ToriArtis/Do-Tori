import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { updatePost, deletePost, likePost, bookmarkPost  } from '../api/postApi';

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

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
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

const DefaultAvatar = ({ size = 40, color = "#cccccc" }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill={color} />
      <circle cx="20" cy="15" r="7" fill="white" />
      <path d="M8 36C8 28.268 13.268 22 21 22C28.732 22 34 28.268 34 36" fill="white" />
    </svg>
  );
  
  export default function PostItem({ post, isCurrentUser, onPostUpdated, onLike, onBookmark, onComment }) {
    const [isDetailView, setIsDetailView] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [commentContent, setCommentContent] = useState('');
    const [editImages, setEditImages] = useState([]);
    const fileInputRef = useRef(null);


 const handleEdit = async (e) => {
    e.stopPropagation();
    if (isEditing) {
      try {
        const formData = new FormData();
        formData.append('content', editContent);
        editImages.forEach(image => {
          formData.append('files', image);
        });
        await updatePost(post.pid, formData);
        setIsEditing(false);
        onPostUpdated();
      } catch (error) {
        console.error('게시글 수정 실패:', error);
        alert('게시글 수정에 실패했습니다.');
      }
    } else {
      setIsEditing(true);
    }
  };
  
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const response = await deletePost(post.pid);
        if (response.ok) {
          onPostUpdated();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || '게시글 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert(`게시글 삭제에 실패했습니다. ${error.message}`);
      }
    }
  };
    const handleLike = async (e) => {
        e.stopPropagation();
        try {
          const result = await likePost(post.pid);
          onLike(post.pid, result);
        } catch (error) {
          console.error('좋아요 처리 실패:', error);
        }
      };
    
      const handleBookmark = async (e) => {
        e.stopPropagation();
        try {
          const result = await bookmarkPost(post.pid);
          onBookmark(post.pid, result);
        } catch (error) {
          console.error('북마크 처리 실패:', error);
        }
      };
    
      const handleComment = (e) => {
        e.preventDefault();
        onComment(post.pid, commentContent);
        setCommentContent('');
      };

      const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + editImages.length > 4) {
          alert('최대 4장의 이미지만 첨부할 수 있습니다.');
          return;
        }
        setEditImages(prevImages => [...prevImages, ...files]);
      };
      
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
                <p>{new Date(post.regDate).toLocaleString()}</p>
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
                🖼️
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
                  <PostImage key={index} src={URL.createObjectURL(image)} alt={`Edit Thumbnail ${index + 1}`} />
                ))}
              </PostImages>
            </>
          ) : (
            <>
              <PostContent>{post.content}</PostContent>
              <PostImages>
                {post.thumbnails && post.thumbnails.map((thumbnail, index) => (
                  <PostImage key={index} src={thumbnail} alt={`Thumbnail ${index + 1}`} />
                ))}
              </PostImages>
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
                  {post.thumbnails && post.thumbnails.map((thumbnail, index) => (
                    <PostImage key={index} src={thumbnail} alt={`Thumbnail ${index + 1}`} />
                  ))}
                </PostImages>
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
                  <CommentButton onClick={handleComment}>댓글 작성</CommentButton>
                </CommentSection>
              </ModalContent>
            </Modal>
          )}
        </PostItemContainer>
      );
    }