import { useState, useCallback } from 'react';
import { likePost, bookmarkPost, createComment, createPost, updatePost, deletePost, fetchPost } from '../api/postApi';

// 게시물 관련 액션을 중앙화하는 커스텀 훅
export const usePostActions = () => {
  const [error, setError] = useState(null);

  const handleLike = useCallback(async (postId) => {
    try {
      const result = await likePost(postId);
      return result;
    } catch (error) {
      setError('좋아요 처리 실패');
      console.error('좋아요 처리 실패:', error);
    }
  }, []);

  const handleBookmark = useCallback(async (postId) => {
    try {
      const result = await bookmarkPost(postId);
      return result;
    } catch (error) {
      setError('북마크 처리 실패');
      console.error('북마크 처리 실패:', error);
    }
  }, []);

  const handleComment = useCallback(async (postId, content) => {
    try {
      const result = await createComment(postId, { content });
      return result;
    } catch (error) {
      setError('댓글 작성 실패');
      console.error('댓글 작성 실패:', error);
      throw error;  // 에러를 throw하여 호출한 곳에서 처리할 수 있도록 합니다.
    }
  }, []);

  const handleCreatePost = useCallback(async (postData) => {
    try {
      const result = await createPost(postData);
      return result;
    } catch (error) {
      setError('게시글 생성 실패');
      console.error('게시글 생성 실패:', error);
    }
  }, []);

  const handleUpdatePost = useCallback(async (postId, postData) => {
    try {
      const result = await updatePost(postId, postData);
      return result;
    } catch (error) {
      setError('게시글 수정 실패');
      console.error('게시글 수정 실패:', error);
    }
  }, []);

  const handleDeletePost = useCallback(async (postId) => {
    try {
      const result = await deletePost(postId);
      console.log("Delete result:", result);  // 결과 로깅
      if (result.ok) {
        return true;
      } else {
        throw new Error(result.error || '서버에서 삭제를 거부했습니다.');
      }
    } catch (error) {
      setError('게시글 삭제 실패: ' + error.message);
      console.error('게시글 삭제 실패:', error);
      throw error;
    }
  }, []);

  const getPostById = useCallback(async (postId) => {
    try {
      const result = await fetchPost(postId);
      return result;
    } catch (error) {
      setError('게시글 조회 실패');
      console.error('게시글 조회 실패:', error);
      throw error; // 에러를 다시 throw하여 호출한 곳에서 처리할 수 있도록 합니다.
    }
  }, []);

  return { 
    handleLike, 
    handleBookmark, 
    handleComment, 
    handleCreatePost, 
    handleUpdatePost, 
    handleDeletePost, 
    getPostById,
    error 
  };
};