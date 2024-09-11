import { getItem } from "@/auth/utils/storage";
import { API_BASE_URL } from "../../config/app-config";

// API 호출을 위한 기본 함수
function call(api, method, request) {
  // 기본 헤더 설정
  let headers = new Headers({
    "Content-Type": "application/json",
  });
  // 로컬 스토리지에서 액세스 토큰 가져오기
  const accessToken = getItem('ACCESS_TOKEN');
  if (accessToken) {
    // 액세스 토큰이 있으면 Authorization 헤더에 추가
    headers.append("Authorization", "Bearer " + accessToken);
  }

  // API 요청 옵션 설정
  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    // GET 메소드가 아닌 경우, 요청 본문을 JSON 문자열로 변환하여 추가
    options.body = JSON.stringify(request);
  }

  // fetch를 사용하여 API 호출
  return fetch(options.url, options).then((response) => {
    if (response.status === 204) {
      return null; // No content
    }
    if (response.ok) {
      // 응답이 JSON인 경우 파싱, 아니면 null 반환
      return response.text().then(text => text ? JSON.parse(text) : null);
    } else if (response.status === 403) {
      // 403 오류(권한 없음)인 경우 로그인 페이지로 리디렉션
      window.location.href = "/login";
    } else {
      // 기타 오류 처리
      return Promise.reject(response);
    }
  }).catch((error) => {
    console.error("Error:", error);
    return Promise.reject(error);
  });
}

// 게시글 생성 함수
export function createPost(postData) {
  const formData = new FormData();
  formData.append('content', postData.content);
  if (postData.tags) {
    postData.tags.forEach(tag => formData.append('tags', tag));
  }
  if (postData.mentionedUserIds) {
    formData.append('mentionedUserIds', postData.mentionedUserIds);
  }
  if (postData.images) {
    postData.images.forEach(image => formData.append('files', image));
  }

  return fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getItem('ACCESS_TOKEN')}`,
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

// 게시글 상세 조회
export const getPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('게시글을 불러오는데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    throw error;
  }
};

// 게시글 수정 함수
export function updatePost(id, formData) {
  const accessToken = getItem('ACCESS_TOKEN');
  return fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
  return call(`/posts/${id}`, "DELETE")
    .then(response => {
      console.log("Delete response:", response);
      if (!response) {
        console.log("서버로부터 응답이 없습니다.");
        return { ok: true };
      }
      if (typeof response === 'object' && response !== null) {
        console.log("Response is an object:", response);
        return { ok: true, ...response };
      }
      return { ok: false, error: "Unexpected response" };
    })
    .catch(error => {
      console.error('Error deleting post:', error);
      throw error;
    });
}

// 게시글 좋아요 함수
export function likePost(id) {
  return call(`/posts/${id}/like`, "POST");
}

// 좋아요한 게시글 목록 조회 함수
export function toriBoxSelectAll() {
  return call("/posts/likes", "GET")
    .then(response => {
      console.log('Fetched liked posts:', response);
      return response;
    })
    .catch(error => {
      console.error('Error fetching liked posts:', error);
      throw error;
    });
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
export const fetchComments = async (postId, { lastCommentId, page, size }) => {
  try {
    let url = `${API_BASE_URL}/posts/${postId}/comments?page=${page}&size=${size}`;
    if (lastCommentId) {
      url += `&lastCommentId=${lastCommentId}`;
    }
    console.log('Fetching comments from URL:', url);
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
      },
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Server error response:', errorBody);
      throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Received comments data:', JSON.stringify(data, null, 2));
    return {
      ...data,
      postLists: data.postLists || []
    };
  } catch (error) {
    console.error('댓글 가져오기 실패:', error);
    throw error;
  }
};

// 인기게시물 조회 함수
export function fetchPopularPosts() {
  return call("/posts/best", "GET")
    .then(response => {
      console.log('Fetched popular posts:', response);
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

// 팔로우 목록 가져오기
export const fetchFollowingUsers = async () => {
  try {
    const userId = getItem('USER_ID');
    if (!userId) {
      console.error('User ID not found');
      return [];
    }
    const response = await call(`/follows/${userId}/followings`, 'GET');
    return response.content || [];
  } catch (error) {
    console.error('팔로우한 사용자 목록 가져오기 실패:', error);
    return [];
  }
};

// 사용자 팔로우 함수
export const followUser = async (userId) => {
  try {
    const response = await call(`/follows/${userId}`, "POST");
    if (response.error) {
      throw new Error(response.error);
    }
    return { success: true, message: response.message };
  } catch (error) {
    console.error('Follow error:', error);
    throw new Error(error.message || '팔로우 처리에 실패했습니다.');
  }
};

// 사용자 언팔로우 함수
export const unfollowUser = async (userId) => {
  try {
    const response = await call(`/follows/${userId}`, "DELETE");
    if (response.error) {
      throw new Error(response.error);
    }
    return { success: true, message: response.message };
  } catch (error) {
    console.error('Unfollow error:', error);
    throw new Error(error.message || '언팔로우 처리에 실패했습니다.');
  }
};

// 사용자 정보 가져오기 함수
export const getUserInfo = async (userId) => {
  return call(`/auth/${userId}`, "GET");
};

// 사용자 게시글 조회 함수
export const fetchUserPosts = async () => {
  try {
    const response = await call('/posts/me', 'GET');
    return response || [];
  } catch (error) {
    console.error('사용자 게시글 조회 실패:', error);
    throw error;
  }
};