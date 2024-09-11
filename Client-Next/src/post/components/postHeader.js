import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PostHeader = ({ post, currentUser, onToggleFollow, isFollowing, showEditDeleteButtons, onMenuOpen, anchorEl, onMenuClose, onEdit, onDelete, hideFollowButton }) => {
  const isCurrentUserPost = currentUser && currentUser.id.toString() === post.aid.toString();

  return (
    <div className="post-header">
      <div className="user-info">
        <img 
          className="avatar" 
          src={post.profileImage || '/default-profile.png'} 
          alt={post.nickName} 
        />
        <div className="user-name-container">
          <h3>{post.nickName}</h3>
          <p>{new Date(post.regDate).toLocaleString()}</p>
        </div>
      </div>
      {currentUser && !isCurrentUserPost && !hideFollowButton && (
        <button onClick={(e) => {
          e.stopPropagation();
          onToggleFollow(post.aid);
        }}
        style={{
          backgroundColor: isFollowing ? '#967F7A' : '#CCBFB2',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
      )}
      {showEditDeleteButtons && isCurrentUserPost && (
        <>
          <IconButton onClick={onMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onMenuClose}
          >
            <MenuItem onClick={onEdit}>수정</MenuItem>
            <MenuItem onClick={onDelete}>삭제</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
};

export default PostHeader;