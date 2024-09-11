import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { usePostActions } from '../hooks/usePostActions';
import { useAuth } from '../../auth/hooks/useAuth';
import PostHeader from './postHeader';
import PostContent from './postContent';
import PostActions from './postActions';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './css/postItem.css';

const PostItem = ({ post, onPostUpdated, onLike, onBookmark, onComment, onToggleFollow, isFollowing, currentUser: propCurrentUser, hideFollowButton, showEditDeleteMenu }) => {
  const router = useRouter();
  const { currentUser: authCurrentUser } = useAuth();
  const { handleLike, handleBookmark, handleDeletePost, error } = usePostActions();
  const [anchorEl, setAnchorEl] = useState(null);

  // const isCurrentUserPost = currentUser && currentUser.id === post.aid.toString();
  const effectiveCurrentUser = propCurrentUser || authCurrentUser;
  const isCurrentUserPost = effectiveCurrentUser && effectiveCurrentUser.id === post.aid.toString();


  const handlePostClick = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('.MuiMenu-root')) {
      return;
    }
    router.push(`/post/${post.pid}`);
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    const result = await handleLike(post.pid);
    if (result) onPostUpdated();
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    const result = await handleBookmark(post.pid);
    if (result) onPostUpdated();
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    router.push(`/post/edit/${post.pid}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await handleDeletePost(post.pid);
        onPostUpdated();
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
      }
    }
    handleMenuClose();
  };

  return (
    <div className="post-item-container" onClick={handlePostClick}>
      <PostHeader 
        post={post}
        currentUser={effectiveCurrentUser}  // 여기를 수정
        onToggleFollow={onToggleFollow}
        isFollowing={isFollowing && isFollowing(post.aid)}
        showEditDeleteButtons={false}
        hideFollowButton={hideFollowButton}
      />
      <PostContent post={post} />
      <PostActions 
        post={post}
        onLike={handleLikeClick}
        onComment={handlePostClick}
        onBookmark={handleBookmarkClick}
      />
      {showEditDeleteMenu && isCurrentUserPost && (
        <>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>수정</MenuItem>
            <MenuItem onClick={handleDelete}>삭제</MenuItem>
          </Menu>
        </>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PostItem;