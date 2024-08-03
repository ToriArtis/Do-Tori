import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { createPost } from '../api/Postapi';


export default function PostCreateView() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            await createPost({ title, content });
            router.replace('/post-list');
        } catch (error) {
            console.error('게시물 생성 실패:', error);
        }
    };

    return (
        <View>
            <TextInput
                placeholder="제목"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                placeholder="내용"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <Button title="등록하기" onPress={handleSubmit} />
        </View>
    );
}