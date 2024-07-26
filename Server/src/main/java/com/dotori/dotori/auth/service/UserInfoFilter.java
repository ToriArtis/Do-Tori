package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.config.exception.ExceptionCode;
import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserInfoFilter {
    private final UserRepository userRepository;

    private void existNickName(String NickName) {
        log.info("NickName = {}", NickName);
        if (NickName == null) return;
        Optional<User> user = userRepository.findByNickName(NickName);
        if (user.isPresent()) throw new BusinessLogicException(ExceptionCode.EXIST_NICK_NAME);
    }

    public void existEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) throw new BusinessLogicException(ExceptionCode.EXIST_EMAIL);
    }

    private void existPhoneNum(String phoneNum) {
        log.info("phone = {}", phoneNum);
        if (phoneNum == null) return;
        Optional<User> user = userRepository.findByPhone(phoneNum);
        if (user.isPresent()) throw new BusinessLogicException(ExceptionCode.EXIST_PHONE_NUMBER);
    }

    public void filterUserInfo(User user) {
        existEmail(user.getEmail());
        existNickName(user.getNickName());
        existPhoneNum(user.getPhone());
    }
}
