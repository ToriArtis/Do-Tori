import React from 'react';
import PostItem from './postItem';

export default function PostList({ posts, onPostUpdated }) {
    return (
        <div>
            {posts.map(post => (
                <PostItem key={post.id} post={post} onPostUpdated={onPostUpdated} />
            ))}
        </div>
    );
}