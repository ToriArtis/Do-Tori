import { useState } from 'react';
import { createAuth, isValidEmail, isValidPassword } from '../models/auth';
import { signup } from '../api/authApi';

export function useSignUpViewModel() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    nickName: '',
    phone: '',
  });


  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!isValidEmail(values.email)) {
      setError('유효하지 않은 이메일 주소입니다.');
      return false;
    }
    if (!isValidPassword(values.password)) {
      setError('비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }
    if (!values.nickName) {
      setError('닉네임을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    // console.log(address);
    event.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    try {
      const user = createAuth(
        values.email,
        values.password,
        values.nickName,
        values.phone
      );
      await signup(user);
      // 성공 처리 로직 (예: 로그인 페이지로 리디렉션)
    } catch (error) {
      setError(error.message);
    }
  };

  return {
    values,
    handleChange,
    handleSubmit,
    error,
  };
}