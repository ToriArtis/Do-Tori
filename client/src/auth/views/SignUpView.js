import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignUpViewModel } from '../viewmodels/useSignUpViewModel'; 
import { useNavigation } from '@react-navigation/native';

export default function SignUpView() {
  const navigation = useNavigation();

  const { 
    values, 
    handleChange,
    handleSubmit, 
    error 
  } = useSignUpViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <View style={styles.form}>
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          style={styles.input} placeholder="이메일" value={values.email} onChangeText={(text) => handleChange('email', text)}/>
        <TextInput
          style={styles.input} placeholder="비밀번호" secureTextEntry value={values.password} onChangeText={(text) => handleChange('password', text)}/>
        <TextInput
          style={styles.input} placeholder="닉네임" value={values.nickName} onChangeText={(text) => handleChange('nickName', text)}/>
        <TextInput
          style={styles.input} placeholder="전화번호" value={values.phone} onChangeText={(text) => handleChange('phone', text)}/>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '48%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});