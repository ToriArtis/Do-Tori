import React from 'react';

export default function PostItem({ post, isPopular = false }) {
    if (isPopular) {
        return (
            <div className="bg-gray-100 rounded p-3">
                <h3 className="font-semibold">HOT POST</h3>
                <p className="text-sm text-gray-500">{post.regDate.substring(0, 10)}</p>
                <div className="flex justify-between text-sm mt-2">
                    <span>❤ {post.toriBoxCount}</span>
                    <span>💬 {post.commentCount}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b pb-4 mb-4 last:border-b-0">
            <div className="flex items-center mb-2">
                <img src={post.profileImage || '/default-avatar.png'} alt={post.nickName} className="w-10 h-10 rounded-full mr-2" />
                <div>
                    <h3 className="font-semibold">{post.nickName}</h3>
                    <p className="text-sm text-gray-500">{post.regDate.substring(0, 10)}</p>
                </div>
            </div>
            <p className="mb-2">{post.content}</p>
            {post.thumbnails && post.thumbnails.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {post.thumbnails.slice(0, 4).map((thumbnail, index) => (
                        <img key={index} src={thumbnail} alt={`Thumbnail ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    ))}
                </div>
            )}
            <div className="flex justify-between text-sm text-gray-500">
                <span>❤ {post.toriBoxCount}</span>
                <span>💬 {post.commentCount}</span>
                <span>🔗</span>
                <span>🔖</span>
            </div>
        </div>
    );
}