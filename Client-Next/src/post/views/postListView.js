import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchPosts, fetchPopularPosts } from '../api/postApi';
import PostCreateBox from '../components/postCreateBox';

const PostListViewContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

const PostItem = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  width: 50%;
`;

export default function PostListView() {
    const [posts, setPosts] = useState([]);

    const loadPosts = async () => {
        try {
            const fetchedPosts = await fetchPosts();
            setPosts(fetchedPosts.postLists || []);
        } catch (error) {
            console.error("게시물 로딩 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <PostListViewContainer>
            <PostCreateBox onPostCreated={loadPosts} />
            <h1>게시물 목록</h1>
            {posts.map((post) => (
                <PostItem key={post.pid}>
                    <h2>{post.content}</h2>
                    <p>작성자: {post.nickName}</p>
                    <p>작성일: {post.regDate}</p>
                </PostItem>
            ))}
        </PostListViewContainer>
    );
}