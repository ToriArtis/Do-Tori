package com.dotori.dotori.service;

import com.dotori.dotori.auth.dto.AuthDTO;
import com.dotori.dotori.auth.dto.LoginDTO;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.repository.AuthRepository;
import com.dotori.dotori.auth.service.AuthService;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootTest
@Log4j2
public class AuthServiceTests {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private AuthService authService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void joinTest(){
        AuthDTO.ResponseDTO authDTO = AuthDTO.ResponseDTO.builder()
                .password("1111")
                .nickName("테스트2")
                .email("ServiceTestUser3@test.com")
                .phone("01033414665")
                .build();
        log.info("authDTO: ", authDTO.getId());
        log.info(authService.join(authDTO));
    }

    @Test
    public void loginUser(){
        String email = "ServiceTestUser3@test.com";
        String password = "1111";
        Auth auth = authService.getByCredentials(email,password);
        log.info(auth);
    }

    @Test
    public void infoTest() {
        AuthDTO.ResponseDTO authDTO = authService.info("ServiceTestUser3@test.com");
        log.info(authDTO);
    }

    @Test
    public void modifyTest(){
        // getLoginUser로 받아와서 이 또한도 알 수 없음~!
        AuthDTO.ResponseDTO authDTO = AuthDTO.ResponseDTO.builder()
                .password("1111")
                .nickName("테스트50")
                .email("ServiceTestUser3@test.com")
                .build();
        authService.modify(authDTO);
        Optional<Auth> auth=authRepository.findById(15L);
        log.info(auth.get().getNickName());
        log.info(auth.get().getEmail());
    }

    @Test
    public void deleteTest() {
        // 요건 토큰이 있어야 해서.. 따로 동작하지 않음 확인~!!
        authService.deleteUser();
    }


}
