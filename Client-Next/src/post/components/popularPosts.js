import React from 'react';
import PostItem from './postItem'; 
import './css/popularPosts.css';

export default function PopularPosts({ posts = [] }) {
    return (
        <div className="popular-posts-container">
            <h2 className="popular-posts-title">HOT 게시물</h2>
            {posts.slice(0, 3).map(post => (
                <div key={post.pid} className="popular-post-item">
                    <h3 className="popular-post-title">{post.content.substring(0, 30)}...</h3>
                    <div className="popular-post-info">
                        <span>❤️ {post.toriBoxCount}</span>
                        <span>💬 {post.commentCount}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}