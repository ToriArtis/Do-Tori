package com.dotori.dotori.auth.config;

import com.dotori.dotori.auth.jwt.JwtAuthenticationFilter;
import com.dotori.dotori.auth.jwt.TokenProvider;
import com.dotori.dotori.auth.repository.UserRepository;
import com.dotori.dotori.auth.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@Log4j2
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Autowired
    private final JwtAuthenticationFilter jwtAuthenticationFilter; // jwt 필터 의존성 주입
    private final CustomUserDetailsService userDetailsService;
    //   private final OAuth2Service oAuth2Service;
    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;
    //    private final OAuth2UserService oAuth2UserService;
    private final PasswordEncoder passwordEncoder;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())  //cors 활성화
                // CSRF 보호 비활성화
                .csrf(csrf -> csrf.disable())

                // HTTP 요청에 대한 인가 설정
                .authorizeHttpRequests(auth -> auth
                        // 나머지 모든 요청은 인증 필요
                        .anyRequest().permitAll()
                )
//                // HTTP 기본 인증 비활성화
                .httpBasic(httpBasic -> httpBasic.disable())
//                .oauth2Login(oauth2 -> oauth2
//                        .userInfoEndpoint(userInfo -> userInfo
//                                .userService(oAuth2UserService)
//                        )
//                        .successHandler(oAuth2AuthenticationSuccessHandler())
//                )
                // 세션 관리 설정을 무상태(stateless)로 설정
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                );

        // JWT 인증 필터를 CORS 필터 이후에 추가
        http.addFilterAfter(jwtAuthenticationFilter, CorsFilter.class);

        http.rememberMe(rememberMe ->
                rememberMe.key("123456789") // 세션에 저장해서 작업할 수 있어야 remember 되기 때문이다.
                        .rememberMeParameter("rememberMe") // 자동 로그인 체크박스의 name 속성 값
                        .tokenValiditySeconds(60 * 60 * 24 * 365) // 1년 : 60 * 60 * 24 * 365
                        .userDetailsService(userDetailsService) // 사용자 정보 서비스 설정
        );

        // 설정된 SecurityFilterChain 반환
        return http.build();
    }

//    @Bean
//    public AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler() {
//        return new OAuth2AuthenticationSuccessHandler(tokenProvider, userRepository, passwordEncoder);
//    }

}