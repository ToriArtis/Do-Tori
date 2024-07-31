// app-config.js 파일에서 API_BASE_URL을 가져옵니다.
import { API_BASE_URL } from "../../config/app-config";

// 헤더를 생성하는 함수
const getHeaders = () => {
  // 기본 헤더 설정
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  
  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    // 액세스 토큰이 있으면 Authorization 헤더에 추가
    headers.append("Authorization", "Bearer " + accessToken);
  }
  return headers;
};

// 게시글 목록을 가져오는 함수
export const fetchPosts = async (pageRequestDTO) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('게시글 목록을 가져오는데 실패했습니다');
  return response.json();
};

// 특정 게시글을 가져오는 함수
export const fetchPost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('게시글을 가져오는데 실패했습니다');
  return response.json();
};

// 새 게시글을 생성하는 함수
export const createPost = async (postDTO, files) => {
  const formData = new FormData();
  formData.append('postDTO', JSON.stringify(postDTO));
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error('게시글 생성에 실패했습니다');
  return response.json();
};

// 게시글을 수정하는 함수
export const updatePost = async (id, postDTO, files, deletedThumbnails) => {
  const formData = new FormData();
  formData.append('postDTO', JSON.stringify(postDTO));
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  deletedThumbnails.forEach((thumbnail, index) => {
    formData.append(`deletedThumbnails`, thumbnail);
  });

  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error('게시글 수정에 실패했습니다');
  return response.json();
};

// 게시글을 삭제하는 함수
export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('게시글 삭제에 실패했습니다');
};

// 게시글에 좋아요를 누르는 함수
export const likePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}/like`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('게시글 좋아요에 실패했습니다');
  return response.json();
};

// 댓글 목록을 가져오는 함수
export const fetchComments = async (postId, pageRequestDTO) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('댓글 목록을 가져오는데 실패했습니다');
  return response.json();
};

// 새 댓글을 생성하는 함수
export const createComment = async (postId, commentDTO) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(commentDTO),
  });
  if (!response.ok) throw new Error('댓글 작성에 실패했습니다');
  return response.json();
};