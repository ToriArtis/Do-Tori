import React from 'react';
import { View } from 'react-native';
import PostCreateView from '../src/post/views/PostCreateView';

export default function PostCreatePage() {
    return (
        <View style={{ flex: 1 }}>
            <PostCreateView />
        </View>
    );
}