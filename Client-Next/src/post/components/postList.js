import React from 'react';
import PostItem from './postItem';

export default function PostList({ posts, onPostUpdated, onLike, onBookmark, onComment }) {
    return (
        <div>
            {posts.map(post => (
                <PostItem 
                    key={post.pid} 
                    post={post} 
                    onPostUpdated={onPostUpdated}
                    onLike={onLike}
                    onBookmark={onBookmark}
                    onComment={onComment}
                />
            ))}
        </div>
    );
}