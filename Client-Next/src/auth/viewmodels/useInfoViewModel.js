import React, { useState, useEffect } from "react";
import { info } from "../api/authApi";

export default function useInfoViewModel() {
    const [values, setValues] = useState({
        email: '',
        password: '',
        bio : '',
        nickName: '',
        phone: '',
        profileImage: '',
        headerImage: ''
    });

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const userInfo = await info();
                setValues(userInfo);
            } 
            catch (error) {
                if(error.error === 'Login failed') {
                    alert('로그인하지 않으셨습니다. 이메일과 비밀번호를 확인해주세요.');
                    window.location.href = '/login';
                }
                alert('회원 정보를 불러오지 못했습니다.');
            }
        }

        fetchUserInfo();
    }, []);

    return {
        ...values,
    };
}