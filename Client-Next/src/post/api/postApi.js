// src/post/api/postApi.js

import { API_BASE_URL, ACCESS_TOKEN } from "../../config/app-config";

// API 호출을 위한 함수

function call(api, method, request) {
    let headers = new Headers({
      "Content-Type": "application/json",
    });
  
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken && accessToken !== null) {
      headers.append("Authorization", "Bearer " + accessToken);
    }
  
    let options = {
      headers: headers,
      method: method,
      credentials: 'include',
    };
  
    let url = API_BASE_URL + api;
  
    if (method === 'GET' && request) {
      const params = new URLSearchParams(request);
      url += '?' + params.toString();
    } else if (request) {
      options.body = JSON.stringify(request);
    }

    return fetch(url, options)
    .then((response) => {
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        return response.text(); // JSON 대신 텍스트로 먼저 받습니다.
    })
    .then((text) => {
        if (!text) {
            return {}; // 빈 응답일 경우 빈 객체 반환
        }
        return JSON.parse(text); // 텍스트를 JSON으로 파싱
    })
    .catch((error) => {
        console.error("API 호출 오류:", error);
        console.error("요청 URL:", url);
        console.error("요청 메소드:", options.method);
        console.error("요청 데이터:", options.body);
        throw error;
    });
}

// 게시글 목록을 가져오는 함수
export const fetchPosts = (pageRequestDTO) => {
  return call("/posts", "GET", pageRequestDTO);
};

// 특정 게시글을 가져오는 함수
export const fetchPost = (id) => {
  return call(`/posts/${id}`, "GET");
};

// 새 게시글을 생성하는 함수
export const createPost = (postDTO, files) => {
  const formData = new FormData();
  formData.append('postDTO', JSON.stringify(postDTO));
  files.forEach((file) => {
    formData.append('files', file);
  });

  return call("/posts", "POST", formData);
};

// 게시글을 수정하는 함수
export const updatePost = (id, postDTO, files, deletedThumbnails) => {
  const formData = new FormData();
  formData.append('postDTO', JSON.stringify(postDTO));
  files.forEach((file) => {
    formData.append('files', file);
  });
  deletedThumbnails.forEach((thumbnail) => {
    formData.append('deletedThumbnails', thumbnail);
  });

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
export const fetchPopularPosts = () => {
  return call("/posts/popular", "GET");
};