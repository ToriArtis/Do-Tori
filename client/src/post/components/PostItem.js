import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PostItem({ post, onPostUpdated }) {
    const router = useRouter();

    const handlePostPress = () => {
        router.push(`/post-detail?id=${post.id}`);
    };

    return (
        <TouchableOpacity onPress={handlePostPress}>
            <View style={styles.container}>
                <Image source={{ uri: post.profileImage }} style={styles.profileImage} />
                <View style={styles.contentContainer}>
                    <Text style={styles.nickname}>{post.nickName}</Text>
                    <Text style={styles.content}>{post.content}</Text>
                    <View style={styles.statsContainer}>
                        <Text>좋아요 {post.likeCount}</Text>
                        <Text>댓글 {post.commentCount}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    contentContainer: {
        flex: 1,
    },
    nickname: {
        fontWeight: 'bold',
    },
    content: {
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
});