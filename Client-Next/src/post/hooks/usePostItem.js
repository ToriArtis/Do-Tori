import { useState, useEffect, useCallback } from 'react';
import { updatePost, deletePost, createComment, fetchComments, deleteComment } from '../api/postApi';
import { format } from 'date-fns';
import { isEqual } from 'lodash';
import { usePostActions } from './usePostActions';
import { useAuth } from '../../auth/hooks/useAuth';

export default function usePostItem(post, onPostUpdated) {
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [editImages, setEditImages] = useState(post.thumbnails || []);
  const [editTags, setEditTags] = useState(post.tags || []);
  const [newTag, setNewTag] = useState('');
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [commentSize, setCommentSize] = useState(10);
  const [postData, setPostData] = useState(post || {});

  const { handleLike, handleBookmark, error } = usePostActions();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);

  const loadComments = useCallback(async (size = 10) => {
    try {
      const response = await fetchComments(postData.pid, { page: 0, size });
      setComments(response.comments || []);
      setTotalComments(response.total);
      setHasMore(response.total > size);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
    }
  }, [postData.pid]);

  useEffect(() => {
    if (isDetailView) {
      loadComments(commentSize);
    }
  }, [isDetailView, commentSize, loadComments]);

  const handleOpenDetailView = () => setIsDetailView(true);
  const handleCloseDetailView = () => setIsDetailView(false);

  const handleEdit = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('postDTO', JSON.stringify({
        pid: postData.pid,
        content: editContent,
        tags: editTags
      }));
      
      const retainedImages = editImages.filter(image => typeof image === 'string');
      if (retainedImages && retainedImages.length > 0) {
        retainedImages.forEach(image => formData.append('retainedImages', image));
      }
      
      editImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`newFiles`, image);
        }
      });

      const updatedPost = await updatePost(postData.pid, formData);
      setPostData(updatedPost);
      setIsEditing(false);
      onPostUpdated();
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(postData.content);
    setEditImages(postData.thumbnails || []);
    setEditTags(postData.tags || []);
    setNewTag('');
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postData.pid);
        alert('게시글이 성공적으로 삭제되었습니다.');
        onPostUpdated();
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
    handleMenuClose();
  };

  const handleLoadMore = () => {
    setCommentSize(prevSize => prevSize + 10);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await createComment(postData.pid, { content: commentContent });
      setCommentContent('');
      loadComments(commentSize);
      onPostUpdated();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const handleReply = async (e, parentId) => {
    e.preventDefault();
    try {
      await createComment(postData.pid, { 
        content: replyContent, 
        parentId: parentId 
      });
      setReplyContent('');
      setReplyingTo(null);
      loadComments(commentSize);
    } catch (error) {
      console.error('답글 작성 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      alert('댓글이 삭제되었습니다.');
      loadComments(commentSize);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleImageOperations = {
    upload: (e) => {
      const files = Array.from(e.target.files);
      if (files.length + editImages.length > 4) {
        alert('최대 4장의 이미지만 첨부할 수 있습니다.');
        return;
      }
      setEditImages(prevImages => [...prevImages, ...files]);
    },
    delete: (index) => {
      setEditImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTagOperations = {
    add: (e) => {
      if (e.key === 'Enter' && newTag.trim() !== '') {
        if (!editTags.includes(newTag.trim())) {
          setEditTags([...editTags, newTag.trim()]);
        }
        setNewTag('');
      }
    },
    delete: (tagToDelete) => {
      setEditTags(editTags.filter(tag => tag !== tagToDelete));
    }
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '날짜 없음' : format(date, 'yyyy. MM. dd. HH:mm:ss');
  };

  const handleSearchResult = useCallback((searchResult) => {
    console.log('Raw search result:', searchResult);
    if (searchResult && !isEqual(searchResult, postData)) {
      const processedPost = {
        ...searchResult,
        thumbnails: searchResult.thumbnail ? [searchResult.thumbnail] : [],
        tags: Array.from(new Set(searchResult.tags || [])),
        toriBoxCount: parseInt(searchResult.toriBoxCount) || 0,
        commentCount: parseInt(searchResult.commentCount) || 0,
        bookmarkCount: parseInt(searchResult.bookmarkCount) || 0,
      };
      console.log('Processed post:', processedPost);
      setPostData(processedPost);
    }
  }, [postData]);
  
  useEffect(() => {
    console.log('Updated postData:', postData);
  }, [postData]);

  return {
    isDetailView,
    setIsDetailView,
    isEditing,
    editContent,
    commentContent,
    replyContent,
    editImages,
    editTags,
    newTag,
    comments,
    replyingTo,
    currentUser,
    anchorEl,
    totalComments,
    hasMore,
    commentSize,
    postData,
    handleOpenDetailView,
    handleCloseDetailView,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleLike,
    handleBookmark,
    handleLoadMore,
    handleComment,
    handleReply,
    handleDeleteComment,
    handleImageOperations,
    handleTagOperations,
    handleMenuOpen,
    handleMenuClose,
    setEditContent,
    setCommentContent,
    setReplyContent,
    setReplyingTo,
    setNewTag,
    formatDate,
    handleSearchResult,
    error,
    isAuthenticated
  };
}