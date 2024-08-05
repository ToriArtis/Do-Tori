import React from 'react';
import PostItem from './postItem'; 

export default function PopularPosts({ posts }) {
    return (
        <div className="bg-white rounded-lg shadow p-4" style={{ width: '300px'}}>
            <h2 className="text-lg font-bold mb-4">HOT 게시물</h2>
            {posts.slice(0, 3).map(post => (
                <div key={post.pid} className="mb-3 last:mb-0">
                    <PostItem post={post} isPopular={true} />
                </div>
            ))}
        </div>
    );
}