import React from 'react';
import PostItem from './postItem'; 
import './css/popularPosts.css';

export default function PopularPosts({ posts = [] }) {
    return (
        <div className="popular-posts-container">
            <h2 className="popular-posts-title">HOT 게시물</h2>
            {/* 최대 3개의 인기 게시물을 표시합니다. */}
            {posts.slice(0, 3).map(post => (
                <div key={post.pid} className="popular-post-item">
                    {/* 게시물 제목 (내용의 처음 30자) */}
                    <h3 className="popular-post-title">{post.content.substring(0, 30)}...</h3>
                    <div className="popular-post-info">
                        {/* 좋아요 수 표시 */}
                        <span>❤️ {post.toriBoxCount}</span>
                        {/* 댓글 수 표시 */}
                        <span>💬 {post.commentCount}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}