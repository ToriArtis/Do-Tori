import React, { useState, useEffect } from 'react';
import PostCreateBox from '../components/postCreateBox';
import PostList from '../components/postList';
import PopularPosts from '../components/popularPosts';
import { fetchPosts, fetchPopularPosts } from '../api/postApi';

export default function PostListView() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        loadPosts();
        loadPopularPosts();
    }, []);

    const loadPosts = async () => {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts.postLists);
    };

    const loadPopularPosts = async () => {
        const fetchedPopularPosts = await fetchPopularPosts();
        // 좋아요 순으로 정렬
        const sortedPopularPosts = fetchedPopularPosts.sort((a, b) => b.toriBoxCount - a.toriBoxCount);
        setPopularPosts(sortedPopularPosts);
    };

    return (
        <div className="container mx-auto px-4 flex">
            <div className="w-3/4 pr-4">
                <div className="mb-6">
                    <PostCreateBox onPostCreated={loadPosts} />
                </div>
                <PostList posts={posts} onPostUpdated={loadPosts} />
            </div>
            <div className="w-1/4">
                <PopularPosts posts={popularPosts} />
            </div>
        </div>
    );
}