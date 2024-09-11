import React, { useState, useCallback } from 'react';
import { useComments } from '../hooks/useComments';
import CommentItem from './commentItem';

const CommentSection = ({ postId, currentUser, onCommentAdded, onCommentDeleted }) => {
  const [newComment, setNewComment] = useState('');
  const { 
    comments, 
    loadMoreComments, 
    addComment, 
    removeComment, 
    error, 
    totalCount,
    hasMore,
    isLoading
  } = useComments(postId);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMoreComments();
    }
  }, [loadMoreComments, isLoading, hasMore]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      await addComment(newComment);
      setNewComment('');
      onCommentAdded();
    }
  }, [newComment, addComment, onCommentAdded]);

  const handleReply = useCallback(async (parentId, content) => {
    await addComment(content, parentId);
    onCommentAdded();
  }, [addComment, onCommentAdded]);

  const handleDelete = useCallback(async (commentId) => {
    await removeComment(commentId);
    onCommentDeleted();
  }, [removeComment, onCommentDeleted]);

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
        />
        <button type="submit">댓글 작성</button>
      </form>
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      ))}
      {hasMore && (
        <button onClick={handleLoadMore} disabled={isLoading}>
          {isLoading ? '댓글 불러오는 중...' : '더보기'}
        </button>
      )}
    </div>
  );
};

export default React.memo(CommentSection);