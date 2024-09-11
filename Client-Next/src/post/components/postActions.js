import React from 'react';

const PostActions = ({ post, onLike, onComment, onBookmark }) => {
  return (
    <div className="post-actions">
      <button className="action-button" onClick={onLike}>
        {post.liked ? '❤️' : '🤍'} {post.toriBoxCount || 0}
      </button>
      <button className="action-button" onClick={onComment}>
        💬 {post.commentCount || 0}
      </button>
      <button className="action-button" onClick={onBookmark}>
        {post.bookmarked ? '🏷️' : '🔖'} {post.bookmarkCount || 0}
      </button>
    </div>
  );
};

export default PostActions;