import React from 'react';
import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import PostListView from '../src/post/views/PostListView';

export default function PostListPage() {
    const router = useRouter();

    return (
        <PostListView />
    );
}