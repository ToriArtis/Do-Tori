import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PostCreateBox from '../components/PostCreateBox';
import PostList from '../components/PostList';
import PopularPosts from '../components/PopularPosts';
import { fetchPosts, fetchPopularPosts } from '../api/postapi';
export default function PostListView() {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        loadPosts();
        loadPopularPosts();
    }, []);

    const loadPosts = async () => {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
    };

    const loadPopularPosts = async () => {
        const fetchedPopularPosts = await fetchPopularPosts();
        setPopularPosts(fetchedPopularPosts);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.mainContent}>
                <PostCreateBox onPostCreated={loadPosts} />
                <PostList posts={posts} onPostUpdated={loadPosts} />
            </ScrollView>
            <View style={styles.sideContent}>
                <PopularPosts posts={popularPosts} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    mainContent: {
        flex: 3,
    },
    sideContent: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#e0e0e0',
        padding: 10,
    },
});