import { useState } from 'react';
import useForm from '../hooks/useForm'; 
import { isValidPassword, loginAuth } from '../models/Auth';
import { passwordFind } from '../api/authsApi';

export function usePasswordFindViewModel() {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
    passwordCheck: '',
  });

  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!values.email ) {
      setError('유효하지 않은 이메일 주소입니다.');
      return false;
    }
    if (!values.password || !isValidPassword(values.password)) {
      setError('비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }
    if (!values.passwordCheck || values.passwordCheck !== values.password) {
      setError('비밀번호를 확인해야 합니다.');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!validateForm()) return;
  
    try {
      const auth = loginAuth(values.email, values.password);
      await passwordFind(values);
      // 성공 시 처리 (예: 알림 표시, 네비게이션 등)
    } catch (error) {
      setError('비밀번호 재설정에 실패했습니다. 이메일을 확인해주세요.');
    }
  };

  return {
    email: values.email,
    password: values.password,
    passwordCheck: values.passwordCheck,
    handleChange,
    handleSubmit,
    error,
  };
}