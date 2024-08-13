import React, { useState, useEffect, useCallback } from 'react';
import { getPostById, likePost, bookmarkPost, createComment, fetchComments, fetchPopularPosts, deleteComment, updatePost, deletePost } from '../api/postApi';
import { API_BASE_URL } from '../../config/app-config';
import PopularPosts from '../components/popularPosts';
import { useRouter } from 'next/router';
import Link from 'next/link';
import './css/postDetailPage.css';
import Sidebar from '@/components/Sidebar';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function PostDetailPage({ postId }) {
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [popularPosts, setPopularPosts] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalComments, setTotalComments] = useState(0);

    const [editTags, setEditTags] = useState([]);
    const [editImages, setEditImages] = useState([]);

    const isAuthenticated = !!localStorage.getItem('ACCESS_TOKEN');
    const currentUserId = localStorage.getItem('USER_ID');

    const fetchPostData = useCallback(async () => {
        try {
            const fetchedPost = await getPostById(postId);
            setPost(fetchedPost);
            setEditContent(fetchedPost.content);
            setTotalComments(fetchedPost.commentCount);
        } catch (error) {
            console.error('게시글 로딩 실패:', error);
        }
    }, [postId]);

    const fetchCommentsData = useCallback(async () => {
      try {
        const response = await fetchComments(postId, { page, size: 10 });
        const newComments = response.postLists || [];
        if (page === 0) {
          setComments(newComments);
        } else {
          setComments(prev => [...prev, ...newComments]);
        }
        setHasMore(newComments.length === 10);
        setTotalComments(response.total);
      } catch (error) {
        console.error('댓글 로딩 실패:', error);
      }
    }, [postId, page]);

    const fetchPopularPostsData = useCallback(async () => {
        try {
            const posts = await fetchPopularPosts();
            setPopularPosts(posts);
        } catch (error) {
            console.error('인기 게시물 로딩 실패:', error);
        }
    }, []);

    useEffect(() => {
        fetchPostData();
        fetchCommentsData();
        fetchPopularPostsData();
    }, [fetchPostData, fetchCommentsData, fetchPopularPostsData]);

    const handleLike = async () => {
        try {
            const result = await likePost(postId);
            setPost(prev => ({ ...prev, liked: result.isLiked, toriBoxCount: result.likeCount }));
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    const handleBookmark = async () => {
        try {
            const result = await bookmarkPost(postId);
            setPost(prev => ({ ...prev, bookmarked: result.isBookmarked, bookmarkCount: result.bookmarkCount }));
        } catch (error) {
            console.error('북마크 처리 실패:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const createdComment = await createComment(postId, { content: newComment });
            setComments(prev => [createdComment, ...prev]);
            setNewComment('');
            setTotalComments(prev => prev + 1);
        } catch (error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    const handleReply = async (e, parentId) => {
        e.preventDefault();
        try {
            const createdReply = await createComment(postId, { content: replyContent, parentId });
            setComments(prev => {
                const updatedComments = [...prev];
                const parentIndex = updatedComments.findIndex(comment => comment.id === parentId);
                if (parentIndex !== -1) {
                    if (!updatedComments[parentIndex].replies) {
                        updatedComments[parentIndex].replies = [];
                    }
                    updatedComments[parentIndex].replies.push(createdReply);
                }
                return updatedComments;
            });
            setReplyContent('');
            setReplyingTo(null);
            setTotalComments(prev => prev + 1);
        } catch (error) {
            console.error('답글 작성 실패:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
      try {
        await deleteComment(commentId);
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? {...comment, content: "삭제된 댓글입니다."} 
            : comment
        ));
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
      setIsEditing(true);
      setEditContent(post.content);
      setEditTags(post.tags || []);
      setEditImages(post.thumbnails || []);
      handleMenuClose();
    };

    const handleSaveEdit = async () => {
      try {
        const formData = new FormData();
        formData.append('postDTO', JSON.stringify({
          pid: post.pid,
          content: editContent,
          tags: editTags,
        }));
        
        editImages.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`newFiles`, image);
          } else {
            formData.append('retainedImages', image);
          }
        });
    
        const updatedPost = await updatePost(postId, formData);
        setPost(prevPost => ({ 
          ...prevPost, 
          content: updatedPost.content,
          tags: updatedPost.tags,
          thumbnails: updatedPost.thumbnails
        }));
        setIsEditing(false);
      } catch (error) {
        console.error('게시글 수정 실패:', error);
        alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
      }
    };
    

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                await deletePost(postId);
                router.push('/posts');
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
            }
        }
        handleMenuClose();
    };

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (!post) return <div>Loading...</div>;

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      setEditImages(prev => [...prev, ...files]);
    };
    
    const handleDeleteImage = (index) => {
      setEditImages(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleAddTag = (e) => {
      if (e.key === 'Enter' && e.target.value.trim() !== '') {
        setEditTags(prev => [...prev, e.target.value.trim()]);
        e.target.value = '';
      }
    };
    
    const handleDeleteTag = (tagToDelete) => {
      setEditTags(prev => prev.filter(tag => tag !== tagToDelete));
    };

    return (
        <div className="post-detail-container">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="main-content">
                <div className="header">
                    <h1 className="page-title">To-rest</h1>
                    <Link href="/todo" className="go-dotori">
                        go Do-Tori →
                    </Link>
                </div>
                <div className="post-content">
                    <div className="post-header">
                        <img src={post.profileImage || '/default-avatar.png'} alt={post.nickName} className="avatar" />
                        <div className="user-info">
                            <h3>{post.nickName}</h3>
                            <p>{new Date(post.regDate).toLocaleString()}</p>
                        </div>
                        {isAuthenticated && currentUserId === post.aid.toString() && (
                            <div>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                    <MenuItem onClick={handleEdit}>수정</MenuItem>
                                    <MenuItem onClick={handleDelete}>삭제</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </div>
                    {isEditing ? (
                        <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div>
                          {editTags.map((tag, index) => (
                            <span key={index}>
                              #{tag}
                              <button onClick={() => handleDeleteTag(tag)}>x</button>
                            </span>
                          ))}
                          <input
                            type="text"
                            onKeyPress={handleAddTag}
                            placeholder="새 태그 추가"
                          />
                        </div>
                        <div>
                          {editImages.map((image, index) => (
                            <div key={index}>
                              {typeof image === 'string' ? (
                                <img src={`${API_BASE_URL}/api/images/${image}`} alt={`Thumbnail ${index + 1}`} />
                              ) : (
                                <img src={URL.createObjectURL(image)} alt={`New Thumbnail ${index + 1}`} />
                              )}
                              <button onClick={() => handleDeleteImage(index)}>삭제</button>
                            </div>
                          ))}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </div>
                        <button onClick={handleSaveEdit}>저장</button>
                        <button onClick={() => setIsEditing(false)}>취소</button>
                      </div>
                    ) : (
                        <p className="post-text">{post.content}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="tag-container">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}
                    {post.thumbnails && post.thumbnails.length > 0 && (
                        <div className="post-images">
                            {post.thumbnails.map((thumbnail, index) => (
                                <img key={index} src={`${API_BASE_URL}/api/images/${thumbnail}`} alt={`Thumbnail ${index + 1}`} className="post-image" />
                            ))}
                        </div>
                    )}
                    <div className="post-actions">
                        <button onClick={handleLike}>
                            {post.liked ? '❤️' : '🤍'} {post.toriBoxCount || 0}
                        </button>
                        <button>💬 {totalComments}</button>
                        <button onClick={handleBookmark}>
                            {post.bookmarked ? '🏷️' : '🔖'} {post.bookmarkCount || 0}
                        </button>
                    </div>
                </div>
                <div className="comments-section">
                    <h3>댓글</h3>
                    <form onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 입력하세요..."
                        />
                        <button type="submit">댓글 작성</button>
                    </form>
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="comment-author">{comment.nickName}</span>
                                <span className="comment-date">{new Date(comment.regDate).toLocaleString()}</span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                            <div className="comment-actions">
                                {isAuthenticated && currentUserId === comment.aid.toString() && (
                                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                )}
                                <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                                    {replyingTo === comment.id ? '답글 취소' : '답글'}
                                </button>
                            </div>
                            {replyingTo === comment.id && (
                                <form onSubmit={(e) => handleReply(e, comment.id)}>
                                    <input
                                        type="text"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="답글을 입력하세요..."
                                    />
                                    <button type="submit">답글 작성</button>
                                </form>
                            )}
                            {comment.replies && comment.replies.map(reply => (
                                <div key={reply.id} className="reply-item">
                                    <div className="comment-header">
                                        <span className="comment-author">{reply.nickName}</span>
                                        <span className="comment-date">{new Date(reply.regDate).toLocaleString()}</span>
                                    </div>
                                    <p className="comment-content">{reply.content}</p>
                                    {isAuthenticated && currentUserId === reply.aid.toString() && (
                                        <button onClick={() => handleDeleteComment(reply.id)}>삭제</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    {hasMore && (
  <button onClick={handleLoadMore}>더보기</button>
)}
                </div>
            </div>
            <div className="side-content">
                <div className="search-and-hot-posts">
                    <PopularPosts posts={popularPosts} />
                </div>
            </div>
        </div>
    );
}