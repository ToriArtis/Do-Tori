import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';

const CommentItem = ({ comment, currentUser, onDelete, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = useCallback(() => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);
    }
  }, [comment.id, replyContent, onReply]);

  const toggleReplies = useCallback(() => {
    setShowReplies(prev => !prev);
  }, []);

  const isDeleted = comment.content === "삭제된 댓글입니다.";

  return (
    <div className="comment-item">
      <div className="comment-header">
        <span className="comment-author">{comment.nickName}</span>
        <span className="comment-date">
          {format(new Date(comment.regDate), 'yyyy-MM-dd HH:mm:ss')}
        </span>
      </div>
      <p className="comment-content" style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
      {!isDeleted && (
        <div className="comment-actions">
          {currentUser && currentUser.id === comment.aid && (
            <button onClick={() => onDelete(comment.id)}>삭제</button>
          )}
          {!comment.parentId && (
            <button onClick={() => setIsReplying(!isReplying)}>
              {isReplying ? '취소' : '답글'}
            </button>
          )}
        </div>
      )}
      {isReplying && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
          />
          <button onClick={handleReply}>답글 작성</button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-section">
          <button onClick={toggleReplies}>
            {showReplies ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
          </button>
          {showReplies && (
            <div className="replies">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onDelete={onDelete}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(CommentItem);