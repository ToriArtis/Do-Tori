import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useProfileViewModel } from '../viewmodels/useProfileViewModel';
import { useFocusEffect } from '@react-navigation/native';

export default function SettingView() {
  const {
    values,
    handleChange,
    handleSubmit,
    error,
    fetchUserInfo
  } = useProfileViewModel();

  const [newPhone, setNewPhone] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
      setNewPhone(''); // 새 전화번호 입력 필드를 초기화
    }, [])
  );

  const handlePhoneChange = (text) => {
    setNewPhone(text);
    handleChange('phone', text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={newPhone} onChangeText={handlePhoneChange} placeholder="새 전화번호" style={styles.input} />
      <TextInput
        value={values.newPassword} onChangeText={(text) => handleChange('newPassword', text)} placeholder="새 비밀번호" secureTextEntry style={styles.input} />
      
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} >
        <Text>변경사항 저장</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'white'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});