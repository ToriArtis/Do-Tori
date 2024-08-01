import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileView() {
    const {
      values,
      handleChange,
      handleSubmit,
      error,
      showModal,
      toggleModal,
      fetchUserInfo
    } = useProfileViewModel();
  
    useFocusEffect(
      React.useCallback(() => {
        fetchUserInfo();
      }, [])
    );

  return (
    <View style={styles.container}>
      <Image source={{ uri: values.headerImage }} style={styles.headerImage} />
      <Image source={{ uri: values.profileImage }} style={styles.profileImage} />
      <Text style={styles.nickName}>{values.nickName}</Text>
      <Text style={styles.bio}>{values.bio}</Text>
      
      <TouchableOpacity onPress={toggleModal} style={styles.editButton}>
        <Text>프로필 수정</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput 
          value={values.nickName} onChangeText={(text) => handleChange('nickName', text)} placeholder="닉네임" style={styles.input} />
          <TextInput
            value={values.bio} onChangeText={(text) => handleChange('bio', text)} placeholder="자기소개" multiline style={styles.input} />

          {/* 프로필, 헤더 이미지 추가해야됨 */}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text>수정 완료</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal} style={styles.cancelButton}>
            <Text>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
  },
  nickName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});