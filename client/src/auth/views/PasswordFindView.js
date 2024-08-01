import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePasswordFindViewModel } from '../viewmodels/usePasswordFindViewModel';
import { useNavigation } from '@react-navigation/native';

export default function PasswordFindView() {
  const navigation = useNavigation();
  const { email, password, passwordCheck, handleChange, handleSubmit, error } = usePasswordFindViewModel();

  const onSubmit = (event) => {
    handleSubmit(event);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 찾기</Text>
      <View style={styles.form}>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          style={styles.input} placeholder="이메일" value={email} onChangeText={(text) => handleChange('email', text)} />
        <TextInput
          style={styles.input} placeholder="새 비밀번호" secureTextEntry value={password} onChangeText={(text) => handleChange('password', text)} />
        <TextInput
          style={styles.input} placeholder="새 비밀번호 확인" secureTextEntry value={passwordCheck} onChangeText={(text) => handleChange('passwordCheck', text)} />

        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate(login)}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});