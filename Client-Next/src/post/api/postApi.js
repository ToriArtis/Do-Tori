/ src/post/api/postApi.js

import { API_BASE_URL } from "../../config/app-config";

// API 호출을 위한 기본 함수
function call(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    options.body = JSON.stringify(request);
  }

  return fetch(options.url, options).then((response) => {
    if (response.status === 204) {
      return null; // No content
    }
    if (response.ok) {
      return response.text().then(text => text ? JSON.parse(text) : null);
    } else if (response.status === 403) {
      window.location.href = "/login";
    } else {
      return Promise.reject(response);
    }
  }).catch((error) => {
    console.error("Error:", error);
    return Promise.reject(error);
  });
}
// // 로그인 함수
// export function signin(userDTO) {
//   return call("/auth/signin", "POST", userDTO);
// }

// // 회원가입 함수
// export function signup(userDTO) {
//   return call("/auth/signup", "POST", userDTO);
// }

// 게시글 생성 함수
export function createPost(formData) {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  return fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || 'Failed to create post');
      });
    }
    return response.json();
  });
}

// 게시글 목록 조회 함수
export function fetchPosts(pageRequestDTO) {
  return call("/posts", "GET", pageRequestDTO);
}

// 특정 게시글 조회 함수
export function fetchPost(id) {
  return call(`/posts/${id}`, "GET");
}


// 게시글 수정 함수
export function updatePost(id, formData) {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  return fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // Content-Type 헤더를 제거합니다.
      // FormData를 사용할 때는 브라우저가 자동으로 적절한 Content-Type을 설정합니다.
    },
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(text || 'Failed to update post');
      });
    }
    return response.json();
  });
}

// 게시글 삭제 함수
export function deletePost(id) {
  return call(`/posts/${id}`, "DELETE");
}

// 게시글 좋아요 함수
export function likePost(id) {
  return call(`/posts/${id}/like`, "POST");
}

// 게시글 북마크 함수
export function bookmarkPost(id) {
  return call(`/posts/${id}/bookmark`, "POST");
}

// 댓글 생성 함수
export function createComment(postId, commentDTO) {
  return call(`/posts/${postId}/comments`, "POST", commentDTO)
    .then(response => {
      console.log('Created comment:', response);
      return response;
    });
}
// 댓글 삭제 함수
export function deleteComment(commentId) {
  return call(`/posts/comments/${commentId}`, "DELETE");
}
// 댓글 목록 조회 함수
export function fetchComments(postId, pageRequestDTO) {
  return call(`/posts/${postId}/comments?page=${pageRequestDTO.page}&size=${pageRequestDTO.size}`, "GET")
    .then(response => {
      console.log('Fetched comments:', response);
      return {
        comments: response.postLists || [],
        total: response.total,
        hasMore: response.total > (pageRequestDTO.page + 1) * pageRequestDTO.size
      };
    })
    .catch(error => {
      console.error('Error fetching comments:', error);
      throw error;
    });
}

export function fetchPopularPosts() {
  return call("/posts/best", "GET")
    .then(response => {
      console.log('Fetched popular posts:', response); // 디버깅을 위해 로그 추가
      return response;
    })
    .catch(error => {
      console.error('Error fetching popular posts:', error);
      throw error;
    });
}

// 게시글 검색 함수
export function searchPosts(types, keyword) {
  return call(`/posts/search?types=${types.join(',')}&keyword=${keyword}`, "GET");
}

// 팔로우한 사용자의 게시글 가져오기
export function fetchFollowingPosts() {
  return call("/posts/following", "GET");
}