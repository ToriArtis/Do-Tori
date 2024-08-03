import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchPostDetail } from '../src/post/api/postapi';
import PostItem from '../src/post/components/PostItem';
import CommentList from '../src/post/components/CommentList';

export default function PostDetailPage() {
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        loadPostDetail();
    }, [id]);

    const loadPostDetail = async () => {
        const fetchedPost = await fetchPostDetail(id);
        setPost(fetchedPost);
    };

    if (!post) return <Text>로딩 중...</Text>;

    return (
        <ScrollView style={styles.container}>
            <PostItem post={post} />
            <CommentList postId={id} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});