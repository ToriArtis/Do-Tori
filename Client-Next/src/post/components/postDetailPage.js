import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePostActions } from '../hooks/usePostActions';
import { useAuth } from '../../auth/hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { fetchPopularPosts } from '../api/postApi';
import { API_BASE_URL } from '../../config/app-config';
import PostHeader from './postHeader';
import PostContent from './postContent';
import PostActions from './postActions';
import CommentSection from './commentSection';
import PopularPosts from './popularPosts';
import SearchComponent from './searchComponent';
import './css/postDetailPage.css';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function PostDetailPage({ postId }) {
  const router = useRouter();
  const { pid } = router.query;
  const { currentUser } = useAuth();
  const { getPostById, handleUpdatePost, handleDeletePost, handleLike, handleBookmark, error: postError } = usePostActions();
  const { 
    comments, 
    loadInitialComments,
    loadMoreComments, 
    addComment, 
    removeComment, 
    error, 
    totalCount,
    hasMore,
    isLoading
  } = useComments(postId);
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (pid) {
        try {
          setLoading(true);
          const fetchedPost = await getPostById(pid);
          setPost(fetchedPost);
          setEditContent(fetchedPost.content);
          setEditTags(fetchedPost.tags || []);
          setEditImages(fetchedPost.thumbnails || []);
        } catch (error) {
          console.error("Failed to fetch post:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [pid, getPostById]);

  useEffect(() => {
    if (pid) {
      loadInitialComments();
    }
  }, [pid, loadInitialComments]);

  useEffect(() => {
    const loadPopularPosts = async () => {
      try {
        const posts = await fetchPopularPosts();
        setPopularPosts(posts);
      } catch (error) {
        console.error('인기 게시글 로딩 실패:', error);
      }
    };
  
    loadPopularPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setAnchorEl(null);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('postDTO', JSON.stringify({
        pid: post.pid,
        content: editContent,
        tags: editTags
      }));
      
      editImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`newFiles`, image);
        } else {
          formData.append('retainedImages', image);
        }
      });

      const updatedPost = await handleUpdatePost(post.pid, formData);
      setPost(updatedPost);
      setIsEditing(false);
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert('게시글 수정에 실패했습니다: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await handleDeletePost(postId);
        router.push('/posts');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
      }
    }
  };

  const handleLikeClick = async () => {
    const result = await handleLike(pid);
    if (result) setPost(prev => ({ ...prev, liked: !prev.liked, toriBoxCount: prev.toriBoxCount + (prev.liked ? -1 : 1) }));
  };

  const handleBookmarkClick = async () => {
    const result = await handleBookmark(pid);
    if (result) setPost(prev => ({ ...prev, bookmarked: !prev.bookmarked, bookmarkCount: prev.bookmarkCount + (prev.bookmarked ? -1 : 1) }));
  };

  const handleCommentAdded = () => {
    setPost(prevPost => ({
      ...prevPost,
      commentCount: (prevPost.commentCount || 0) + 1
    }));
  };

  const handleCommentDeleted = () => {
    setPost(prevPost => ({
      ...prevPost,
      commentCount: Math.max((prevPost.commentCount || 0) - 1, 0)
    }));
  };

  return (
    <div className="post-detail-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">
            <Link href="/posts" className="go-torest">
              To-rest
            </Link>
          </h1>
          <Link href="/todo" className="go-dotori">
            go Do-Tori →
          </Link>
        </div>
        
        <PostHeader 
      post={post}
      currentUser={currentUser}
      // showEditDeleteButtons={true}
      showEditDeleteButtons={currentUser && currentUser.id === post.aid}
      onMenuOpen={(e) => setAnchorEl(e.currentTarget)}
      anchorEl={anchorEl}
      onMenuClose={() => setAnchorEl(null)}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hideFollowButton={true} // 새로운 prop 추가
    />
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="내용을 입력하세요..."
              style={{ minHeight: '200px' }}
            />
            <div className="edit-tags">
              {editTags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button onClick={() => setEditTags(editTags.filter((_, i) => i !== index))}>x</button>
                </span>
              ))}
              <input
                type="text"
                placeholder="새 태그 추가 (Enter로 추가)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    setEditTags([...editTags, e.target.value]);
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="edit-images">
              {editImages.map((image, index) => (
                <div key={index}>
                  <img src={image instanceof File ? URL.createObjectURL(image) : `${API_BASE_URL}/images/${image}`} alt={`Thumbnail ${index}`} />
                  <button onClick={() => setEditImages(editImages.filter((_, i) => i !== index))}>x</button>
                </div>
              ))}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImages([...editImages, ...e.target.files])}
              />
            </div>
            <button type="submit" onClick={handleSaveEdit}>저장</button>
            <button type="button" onClick={() => setIsEditing(false)}>취소</button>
          </div>
        ) : (
          <PostContent post={post} />
        )}
        <PostActions 
          post={post}
          onLike={handleLikeClick}
          onComment={() => {}}
          onBookmark={handleBookmarkClick}
        />
        <CommentSection 
          postId={post.pid}
          comments={comments}
          onAddComment={addComment}
          onDeleteComment={removeComment}
          onLoadMore={loadMoreComments}
          currentUser={currentUser}
          hasMore={hasMore}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
          onReplyAdded={handleCommentAdded}
        />
      </div>
      <div className="side-content">
        <PopularPosts posts={popularPosts} />
      </div>
    </div>
  );
}