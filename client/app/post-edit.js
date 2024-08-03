import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PostEditView from '../src/post/views/PostEditView';

export default function PostEditPage() {
    const { id } = useLocalSearchParams();

    return (
       <PostEditView/>
    );
}