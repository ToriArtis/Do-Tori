import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPostById, addComment, deletePost } from '../api/postApi';
import './css/PostDetailPage.css';

export default function PostDetailPage() {
  const router = useRouter();
  const { pid } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (pid) {
      fetchPost();
    }
  }, [pid]);

  const fetchPost = async () => {
    const fetchedPost = await getPostById(pid);
    setPost(fetchedPost);
    setComments(fetchedPost.comments);
  };

  const handleAddComment = async () => {
    await addComment(pid, newComment);
    setNewComment('');
    fetchPost();
  };

  const handleDeletePost = async () => {
    await deletePost(pid);
    router.push('/');
  };

  const handleEditPost = () => {
    router.push(`/edit-post/${pid}`);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <div className="user-info">
          <img src={post.profileImage || "/default-avatar.png"} alt={post.nickName} className="avatar" />
          <div>
            <h3>{post.nickName}</h3>
            <p>{new Date(post.regDate).toLocaleString()}</p>
          </div>
        </div>
        <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>⋮</button>
        {showMenu && (
          <div className="menu-dropdown">
            <button onClick={handleEditPost}>수정</button>
            <button onClick={handleDeletePost}>삭제</button>
          </div>
        )}
      </div>
      <p className="post-content">{post.content}</p>
      {post.thumbnails && post.thumbnails.length > 0 && (
        <div className="post-images">
          {post.thumbnails.map((thumbnail, index) => (
            <img key={index} src={thumbnail} alt={`Thumbnail ${index + 1}`} className="post-image" />
          ))}
        </div>
      )}
      <div className="post-actions">
        <button className="action-button">
          {post.liked ? '❤️' : '🤍'} {post.toriBoxCount}
        </button>
        <button className="action-button">
          💬 {post.commentCount}
        </button>
        <button className="action-button">
          {post.bookmarked ? '🏷️' : '🔖'} {post.bookmarkCount}
        </button>
      </div>
      <div className="comments-section">
        <h3>댓글</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <img src={comment.profileImage || "/default-avatar.png"} alt={comment.nickName} className="avatar" />
            <div>
              <h4>{comment.nickName}</h4>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
        <div className="add-comment">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
          />
          <button onClick={handleAddComment}>등록</button>
        </div>
      </div>
    </div>
  );
}