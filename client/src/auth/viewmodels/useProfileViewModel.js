import { useState, useEffect } from 'react';
import { info, modify } from '../api/authsApi';
import { isValidPassword } from '../models/Auth';
import useForm from '../hooks/useForm';
import { useNavigation } from '@react-navigation/native';

export function useProfileViewModel() {
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { values, handleChange, setValues } = useForm({
    email: '',
    nickName: '',
    phone: '',
    profileImage: '',
    headerImage: '',
    bio: '',
    password: '',
    newPassword: '',
  });

  // 사용자 정보 가져옴
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // api 호출로 사용자 정보 가져옴
      const userInfo = await info();
      // 기존 값과 새로운 정보 병합
      setValues(prevValues => ({ ...prevValues, ...userInfo }));
    } catch (error) {
      setError('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async (type) => {
    setError(null);
    try {
      let dataToSubmit = { ...values };
      
      if (type === 'profile') {
        // 프로필 수정 시 필요한 필드만 변경
        dataToSubmit = {
          ...dataToSubmit,
          nickName: values.nickName,
          bio: values.bio,
          profileImage: values.profileImage,
          headerImage: values.headerImage,
        };
      } else if (type === 'settings') {
        // 설정 수정 시 필요한 필드만 변경
        if (values.newPassword && !isValidPassword(values.newPassword)) {
          throw new Error('비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.');
        }

        dataToSubmit = {
          ...dataToSubmit,
          phone: values.phone,
          password: values.password,
          newPassword: values.newPassword,
        };
      }

      // api 호출로 정보 수정
      const updatedInfo = await modify(dataToSubmit);
      // 수정된 정보 업데이트
      setValues(prevValues => ({ ...prevValues, ...updatedInfo }));
      setShowModal(false);
      alert('정보가 성공적으로 수정되었습니다.');
      navigation.navigate('post');
    } catch (error) {
      setError(error.message || '정보 수정 중 오류가 발생했습니다.');
    }
  };

  // 모달 표시
  const toggleModal = () => setShowModal(!showModal);

  return {
    values,
    handleChange,
    handleSubmit,
    error,
    showModal,
    toggleModal,
    fetchUserInfo
  };
}