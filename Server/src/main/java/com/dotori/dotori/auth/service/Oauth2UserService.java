package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class Oauth2UserService extends DefaultOAuth2UserService {
    private final AuthRepository authRepository;

    private PasswordEncoder encodePw(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    };

}
