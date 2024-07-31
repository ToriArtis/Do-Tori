import React from 'react';
import { FlatList, View, Text } from 'react-native';
import PostItem from './PostItem';

// 게시글 목록을 표시하는 컴포넌트
const PostList = ({ posts, onPostPress }) => {
  // 게시글이 없는 경우 메시지 표시
  if (!posts || posts.length === 0) {
    return <Text>게시글이 없습니다.</Text>;
  }

  // FlatList를 사용하여 게시글 목록 렌더링
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.pid.toString()}
      renderItem={({ item }) => (
        <PostItem post={item} onPress={() => onPostPress(item.pid)} />
      )}
    />
  );
};

export default PostList;