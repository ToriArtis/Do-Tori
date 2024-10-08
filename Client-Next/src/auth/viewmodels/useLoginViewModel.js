import { useState } from 'react';
import { login } from "../api/authLoginApi";
import useForm from '../hooks/useForm'; 

export function useLoginViewModel() {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(values);
    } catch (error) {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return {
    email: values.email,
    password: values.password,
    handleChange,
    handleSubmit,
  };
}