import React, { useState } from 'react';
import { createPost } from '../api/postApi';

export default function PostCreateBox({ onPostCreated }) {
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            await createPost({ content });
            setContent('');
            onPostCreated();
        } catch (error) {
            console.error('게시물 생성 실패:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center mb-2">
                <img src="/default-avatar.png" alt="Profile" className="w-10 h-10 rounded-full mr-2" />
                <input
                    type="text"
                    placeholder="무슨 일이 있나요?"
                    className="flex-grow p-2 border rounded"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div className="flex justify-between">
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                    <span role="img" aria-label="Image">🖼️</span>
                </button>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleSubmit}
                >
                    등록
                </button>
            </div>
        </div>
    );
}