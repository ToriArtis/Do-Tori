import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import CommentList from '../components/CommentList';
import { fetchPost, fetchComments } from '../api/Postapi';

// 게시글 상세 정보를 표시하는 뷰 컴포넌트
const PostDetailView = ({ route }) => {
  // route 파라미터에서 postId 추출
  const { postId } = route.params;
  
  // 상태 관리
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 게시글과 댓글 로드
  useEffect(() => {
    loadPostAndComments();
  }, [postId]);

  // 게시글과 댓글을 로드하는 함수
  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      const postData = await fetchPost(postId);
      setPost(postData);
      const commentsData = await fetchComments(postId, { size: 10 });
      setComments(commentsData.postLists);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중 표시
  if (loading) return <Text>로딩 중...</Text>;
  // 에러 표시
  if (error) return <Text>에러: {error}</Text>;
  // 게시글이 없는 경우 표시
  if (!post) return <Text>게시글을 찾을 수 없습니다</Text>;

  // 게시글 상세 정보 및 댓글 렌더링
  return (
    <ScrollView style={styles.container}>
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Image source={{ uri: post.profileImage }} style={styles.profileImage} />
          <Text style={styles.nickName}>{post.nickName}</Text>
        </View>
        <Text style={styles.content}>{post.content}</Text>
        {post.thumbnails && post.thumbnails.length > 0 && (
          <Image source={{ uri: post.thumbnails[0] }} style={styles.thumbnail} />
        )}
        <View style={styles.footer}>
          <Text>좋아요: {post.toriBoxCount}</Text>
          <Text>댓글: {post.commentCount}</Text>
        </View>
      </View>
      <View style={styles.commentsContainer}>
        <Text style={styles.commentsTitle}>댓글</Text>
        <CommentList comments={comments} />
      </View>
    </ScrollView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickName: {
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentsContainer: {
    padding: 10,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PostDetailView;