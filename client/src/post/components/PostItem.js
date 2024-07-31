import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// 개별 게시글 항목을 표시하는 컴포넌트
const PostItem = ({ post, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
    </TouchableOpacity>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
});

export default PostItem;