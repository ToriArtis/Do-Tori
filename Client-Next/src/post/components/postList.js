import React from 'react';
import postItem from './postItem';
export default function postList({ posts, onPostUpdated }) {
    return (
        <div>
            {posts.map(post => (
                <postItem key={post.id} post={post} onPostUpdated={onPostUpdated} />
            ))}
        </div>
    );
}