import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PostList from '../components/PostList';
import { fetchPosts } from '../api/Postapi';

// 게시글 목록을 표시하는 뷰 컴포넌트
const PostListView = ({ navigation }) => {
  // 상태 관리
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 게시글 로드
  useEffect(() => {
    loadPosts();
  }, []);

  // 게시글 로드 함수
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetchPosts({ size: 10 });
      setPosts(response.postLists);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 클릭 핸들러
  const handlePostPress = (postId) => {
    navigation.navigate('PostDetail', { postId });
  };

  // 로딩 중 표시
  if (loading) return <Text>로딩 중...</Text>;
  // 에러 표시
  if (error) return <Text>에러: {error}</Text>;

  // 게시글 목록 렌더링
  return (
    <View style={styles.container}>
      <PostList posts={posts} onPostPress={handlePostPress} />
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default PostListView;