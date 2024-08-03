import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { createPost } from '../api/postapi';

export default function PostCreateBox({ onPostCreated }) {
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        try {
            await createPost({ content });
            setContent('');
            onPostCreated();
        } catch (error) {
            console.error('게시물 생성 실패:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="무슨 일이 있나요?"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <Button title="등록" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    input: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
    },
});