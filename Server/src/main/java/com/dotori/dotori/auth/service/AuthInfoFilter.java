package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.config.exception.ExceptionCode;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthInfoFilter {
    private final AuthRepository authRepository;

    private void existNickName(String NickName) {
        log.info("NickName = {}", NickName);
        if (NickName == null) return;
        Optional<Auth> user = authRepository.findByNickName(NickName);
        if (user.isPresent()) throw new BusinessLogicException(ExceptionCode.EXIST_NICK_NAME);
    }

    public void existEmail(String email) {
        Optional<Auth> user = authRepository.findByEmail(email);
        if (user.isPresent()) throw new BusinessLogicException(ExceptionCode.EXIST_EMAIL);
    }

    private void existPhoneNum(String phoneNum) {
        log.info("phone = {}", phoneNum);
        if (phoneNum == null) return;
        Optional<Auth> user = authRepository.findByPhone(phoneNum);
        if (user.isPresent()) throw new BusinessLogicException(ExceptionCode.EXIST_PHONE_NUMBER);
    }

    public void filterUserInfo(Auth auth) {
        existEmail(auth.getEmail());
        existNickName(auth.getNickName());
        existPhoneNum(auth.getPhone());
    }
}
