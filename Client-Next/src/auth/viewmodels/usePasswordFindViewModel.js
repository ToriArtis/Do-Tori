import { useState } from 'react';
import useForm from '../hooks/useForm'; 
import { isValidPassword, loginAuth } from '../models/auth';
import { passwordFind } from '../api/authApi';

export function usePasswordFindViewModel() {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
    passwordCheck: '',
  });

  const validateForm = () => {
    if (!values.email ) {
      alert('유효하지 않은 이메일 주소입니다.');
      return false;
    }
    if (!values.password || !isValidPassword(values.password)) {
      alert('비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }
    if (!values.passwordCheck || values.passwordCheck !== values.password) {
      alert('비밀번호를 확인해야 합니다.');
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
        const auth = loginAuth(
          values.email,
          values.password
        )
        await passwordFind(values);
      
    } catch (error) {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      alert('이메일을 찾지 못했습니다.');
    }
  };

  return {
    email: values.email,
    password: values.password,
    passwordCheck: values.passwordCheck,
    handleChange,
    handleSubmit,
  };
}