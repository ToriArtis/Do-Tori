import React, { createContext, useState, useContext, useCallback } from 'react';
import { call } from '../api/Postapi';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (pageRequestDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await call('/posts', 'GET', pageRequestDTO);
      setPosts(response.postLists);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (postDTO, files) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('postDTO', JSON.stringify(postDTO));
      files.forEach((file) => {
        formData.append(`files`, file);
      });
      const response = await call('/posts', 'POST', formData);
      setPosts(prevPosts => [response, ...prevPosts]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (pid) => {
    try {
      await call(`/posts/${pid}/like`, 'POST');
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.pid === pid 
            ? {...post, liked: !post.liked, toriBoxCount: post.toriBoxCount + (post.liked ? -1 : 1)} 
            : post
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // 여기에 댓글, 대댓글, 인기 게시물 등의 함수를 추가할 수 있습니다.

  return (
    <PostContext.Provider value={{ posts, loading, error, fetchPosts, addPost, likePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);