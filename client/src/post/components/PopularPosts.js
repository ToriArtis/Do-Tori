import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PostItem from './PostItem';

export default function PopularPosts({ posts }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>인기 게시물</Text>
            <FlatList
                data={posts}
                renderItem={({ item }) => <PostItem post={item} />}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});