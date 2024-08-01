import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { deleteUser } from "../api/authsApi";
import { useNavigation } from '@react-navigation/native';
import Logout from '../api/userLoginApi';

export default function DeleteView() {
    const [deleteStatus, setDeleteStatus] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        // 컴포넌트 마운트 시 확인 다이얼로그 표시
        Alert.alert(
            "회원 탈퇴 확인",
            "정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
            [
                {
                    text: "아니오",
                    onPress: () => navigation.navigate('Home'),
                    style: "cancel"
                },
                { text: "예, 탈퇴하겠습니다", onPress: handleDeleteUser }
            ]
        );
    }, []);

    const handleDeleteUser = async () => {
        try {
            const result = await deleteUser();
            setDeleteStatus(result);
            if (result) {
                Alert.alert("탈퇴 처리", "탈퇴 처리되었습니다. 잠시 후 로그인 페이지로 이동합니다.");
                setTimeout(() => {
                    Logout();
                    navigation.navigate('Login');
                }, 3000);
            }
        } catch (error) {
            setDeleteStatus(false);
            Alert.alert("탈퇴 실패", "탈퇴 처리에 실패했습니다. 잠시 후 로그아웃됩니다.");
            setTimeout(() => {
                Logout();
                navigation.navigate('Login');
            }, 3000);
        }
    };

    return (
        <View style={styles.container}>
            {deleteStatus !== null && (
                <Text style={[styles.statusText, { color: deleteStatus ? 'green' : 'red' }]}>
                    {deleteStatus 
                        ? "탈퇴 처리되었습니다. 잠시 후 로그인 페이지로 이동합니다." 
                        : "탈퇴 처리에 실패했습니다. 잠시 후 로그아웃됩니다."}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    statusText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});