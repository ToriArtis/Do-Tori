package com.dotori.dotori.auth.config;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.entity.AuthStatus;
import com.dotori.dotori.auth.jwt.TokenProvider;
import com.dotori.dotori.auth.repository.AuthRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        Auth auth = authRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setNickName(name);
                    existingUser.setProvider(registrationId); // provider 정보 업데이트
                    return authRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    Auth newUser = Auth.builder()
                            .email(email)
                            .nickName(name)
                            .provider(registrationId)
                            .authStatus(AuthStatus.AUTH_ACTIVE)
                            .password(passwordEncoder.encode("1111"))  // 초기 비밀번호를 "1111"로 설정하고 인코딩
                            .build();
                    return authRepository.save(newUser);
                });

        String token = tokenProvider.createAccessToken(auth);

        getRedirectStrategy().sendRedirect(request, response, "/oauth2/redirect?token=" + token);
    }
}