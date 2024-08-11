import React from 'react';
import PostItem from './postItem';
import './css/postList.css';

export default function PostList({ posts, onPostUpdated, onLike, onBookmark, onComment, currentUser, followingUsers, onToggleFollow }) {
    const isFollowing = (userId) => {
        return followingUsers.some(user => user.userId === userId);
    };
  
    return (
        <div className="post-list">
          {posts.map(post => (
            <PostItem 
              key={post.pid} 
              post={post} 
              onPostUpdated={onPostUpdated}
              onLike={onLike}
              onBookmark={onBookmark}
              onComment={onComment}
              isFollowing={isFollowing(post.aid)}
              onToggleFollow={onToggleFollow}
              currentUser={currentUser}
            />
          ))}
        </div>
      );
  }