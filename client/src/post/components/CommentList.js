import React from 'react';
import { FlatList, Text } from 'react-native';
import CommentItem from './CommentItem';

// 댓글 목록을 표시하는 컴포넌트
const CommentList = ({ comments }) => {
  // 댓글이 없는 경우 메시지 표시
  if (!comments || comments.length === 0) {
    return <Text>아직 댓글이 없습니다.</Text>;
  }

  // FlatList를 사용하여 댓글 목록 렌더링
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <CommentItem comment={item} />}
    />
  );
};

export default CommentList;