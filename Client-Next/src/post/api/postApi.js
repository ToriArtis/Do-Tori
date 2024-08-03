// src/post/api/postApi.js

import { API_BASE_URL, ACCESS_TOKEN } from "../../config/app-config";

// API 호출을 위한 함수
function call(api, method, request) {
  let headers = new Headers();

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  let options = {
    headers: headers,
    method: method,
    credentials: 'include',
  };

  if (request instanceof FormData) {
    options.body = request;
  } else if (method !== 'GET' && request) {
    headers.append("Content-Type", "application/json");
    options.body = JSON.stringify(request);
  }

  return fetch(API_BASE_URL + api, options)
    .then((response) => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        });
      }
      return response.json();
    });
}

// 게시글 목록을 가져오는 함수
export const fetchPosts = async () => {
  try {
      const response = await call("/posts", "GET");
      return response;
  } catch (error) {
      console.error("게시물 가져오기 실패:", error);
      return { postLists: [] };
  }
};

// 특정 게시글을 가져오는 함수
export const fetchPost = (id) => {
  return call(`/posts/${id}`, "GET");
};

// 게시글을 등록하는 함수
export const createPost = (formData) => {
  return call("/posts", "POST", formData);
};

// 게시글을 수정하는 함수
export const updatePost = (id, formData) => {
  return call(`/posts/${id}`, "PUT", formData);
};

// 게시글을 삭제하는 함수
export const deletePost = (id) => {
  return call(`/posts/${id}`, "DELETE");
};
// 게시글에 좋아요를 누르는 함수
export const likePost = (id) => {
  return call(`/posts/${id}/like`, "POST");
};

// 댓글 목록을 가져오는 함수
export const fetchComments = (postId, pageRequestDTO) => {
  return call(`/posts/${postId}/comments`, "GET", pageRequestDTO);
};

// 새 댓글을 생성하는 함수
export const createComment = (postId, commentDTO) => {
  return call(`/posts/${postId}/comments`, "POST", commentDTO);
};

// 인기 게시물 5개를 가져오는 함수
export const fetchPopularPosts = async () => {
  try {
      const response = await call("/posts/popular", "GET");
      return response;
  } catch (error) {
      console.error("인기 게시물 가져오기 실패:", error);
      return [];
  }
};

export const bookmarkPost = (id) => {
  return call(`/posts/${id}/bookmark`, "POST");
};