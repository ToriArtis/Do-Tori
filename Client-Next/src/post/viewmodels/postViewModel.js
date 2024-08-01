import { useState, useCallback } from 'react';
import { Post } from '../models/post';
import * as postApi from '../api/postApi';

// PostViewModel: 게시글 관련 비즈니스 로직과 상태를 관리합니다.
export const usePostViewModel = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  // 게시글 목록을 가져오는 함수
  const fetchPosts = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const pageRequestDTO = { page, size };
      const response = await postApi.fetchPosts(pageRequestDTO);
      if (response && response.postLists) {
        setPosts(response.postLists.map(post => new Post(post)));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 새 게시글을 추가하는 함수
  const addPost = useCallback(async (postDTO, files) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.createPost(postDTO, files);
      setPosts(prevPosts => [new Post(response), ...prevPosts]);
    } catch (error) {
      setError(error.message || 'Failed to add post');
      console.error('Error adding post:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 게시글 좋아요 토글 함수
  const likePost = useCallback(async (pid) => {
    try {
      const response = await postApi.likePost(pid);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.pid === pid 
            ? {...post, liked: response, toriBoxCount: post.toriBoxCount + (response ? 1 : -1)} 
            : post
        )
      );
    } catch (error) {
      setError(error.message || 'Failed to like/unlike post');
      console.error('Error liking/unliking post:', error);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    likePost,
  };
};