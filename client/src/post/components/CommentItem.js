import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// 개별 댓글 항목을 표시하는 컴포넌트
const CommentItem = ({ comment }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.profileImage }} style={styles.profileImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.nickName}>{comment.nickName}</Text>
        <Text>{comment.content}</Text>
      </View>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  nickName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CommentItem;