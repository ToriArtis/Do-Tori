package com.dotori.dotori.auth.config;

import com.dotori.dotori.auth.jwt.JwtAuthenticationFilter;
import com.dotori.dotori.auth.jwt.TokenProvider;
import com.dotori.dotori.auth.repository.AuthRepository;
import com.dotori.dotori.auth.service.CustomAuthDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

@Configuration
@Log4j2
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAuthDetailsService userDetailsService;
    //   private final OAuth2Service oAuth2Service;
    private final TokenProvider tokenProvider;
    private final AuthRepository authRepository;
    //    private final OAuth2UserService oAuth2UserService;
    private final PasswordEncoder passwordEncoder;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())  //cors 활성화
                // CSRF 보호 비활성화
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                // HTTP 요청에 대한 인가 설정
                .authorizeHttpRequests(auth -> auth
                        // 공개 접근 허용 경로
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll() // 이 줄을 추가
                        .requestMatchers(HttpMethod.GET, "/posts", "/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "post/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "todo/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        // 이 외엔 인증 필요
                        .anyRequest().authenticated()
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
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
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