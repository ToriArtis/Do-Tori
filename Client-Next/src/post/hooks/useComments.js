import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchComments, createComment, deleteComment } from '../api/postApi';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0);
  const PAGE_SIZE = 10;

  const structureComments = useCallback((flatComments) => {
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    flatComments.forEach(comment => {
      if (comment.parentId) {
        const parentComment = commentMap[comment.parentId];
        if (parentComment) {
          parentComment.replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  }, []);

  const countVisibleComments = useCallback((commentsList) => {
    return commentsList.reduce((count, comment) => 
      count + 1 + (comment.replies ? comment.replies.length : 0), 0
    );
  }, []);

  const loadComments = useCallback(async (isInitial = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await fetchComments(postId, { 
        page: isInitial ? 0 : pageRef.current,
        size: PAGE_SIZE 
      });
      
      if (result.postLists && result.postLists.length > 0) {
        const newComments = structureComments(result.postLists);
        setComments(prev => {
          const updatedComments = isInitial ? newComments : [...prev, ...newComments];
          return updatedComments;
        });
        setTotalCount(result.total);
        setHasMore(result.total > (pageRef.current + 1) * PAGE_SIZE);
        pageRef.current += 1;
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
      setError('댓글을 불러오는데 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setIsLoading(false);
    }
  }, [postId, structureComments]);

  const loadInitialComments = useCallback(() => {
    pageRef.current = 0;
    loadComments(true);
  }, [loadComments]);

  useEffect(() => {
    loadInitialComments();
  }, [loadInitialComments]);

  const loadMoreComments = useCallback(() => {
    if (hasMore && !isLoading) {
      loadComments(false);
    }
  }, [loadComments, hasMore, isLoading]);

  const addComment = useCallback(async (content, parentId = null) => {
    try {
      const newComment = await createComment(postId, { content, parentId });
      setComments(prev => {
        let updatedComments;
        if (parentId) {
          updatedComments = prev.map(comment => {
            if (comment.id === parentId) {
              return { 
                ...comment, 
                replies: [newComment, ...(comment.replies || [])]
              };
            }
            return comment;
          });
        } else {
          updatedComments = [newComment, ...prev];
        }
        const visibleCount = countVisibleComments(updatedComments);
        return visibleCount > PAGE_SIZE ? updatedComments.slice(0, -1) : updatedComments;
      });
      setTotalCount(prev => prev + 1);
      setHasMore(totalCount + 1 > PAGE_SIZE);
    } catch (error) {
      console.error('댓글 추가 실패:', error);
      setError('댓글 추가에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    }
  }, [postId, totalCount, countVisibleComments]);

  const removeComment = useCallback(async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content: "삭제된 댓글입니다.", isDeleted: true };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, content: "삭제된 댓글입니다.", isDeleted: true }
                  : reply
              )
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      setError('댓글 삭제에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    }
  }, []);

  return {
    comments,
    loadInitialComments,
    loadMoreComments,
    addComment,
    removeComment,
    error,
    totalCount,
    hasMore,
    isLoading
  };
};