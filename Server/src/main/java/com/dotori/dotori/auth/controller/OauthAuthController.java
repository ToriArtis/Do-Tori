package com.dotori.dotori.auth.controller;

import com.dotori.dotori.auth.dto.AuthDTO;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.entity.OAuthAttributes;
import com.dotori.dotori.auth.jwt.TokenProvider;
import com.dotori.dotori.auth.service.OAuth2Service;
import lombok.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/oauth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OauthUserController {

    private final OAuth2Service oAuth2Service;
    private final TokenProvider tokenProvider;

    @Autowired
    public OauthUserController(OAuth2Service oAuth2Service, TokenProvider tokenProvider) {
        this.oAuth2Service = oAuth2Service;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestBody TokenRequest tokenRequest) {
        try {
            OAuth2User oAuth2User = oAuth2Service.processCode(tokenRequest.getCode(), tokenRequest.getProvider());
            OAuthAttributes attributes = OAuthAttributes.of(tokenRequest.getProvider(), "sub", oAuth2User.getAttributes());
            Auth auth = oAuth2Service.saveOrUpdate(attributes);
            String accessToken = tokenProvider.createAccessToken(auth);   // token 생성
            String refreshToken = tokenProvider.createRefreshToken(auth);
            log.info("Token created successfully for user: {}", auth.getEmail());
            return ResponseEntity.ok(
                    AuthDTO.LoginDTO.builder()
                            .email(auth.getEmail())
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .nickName(auth.getNickName())
                            .provider(auth.getProvider())
                            .build()
            );
        } catch (Exception e) {
            log.error("Token exchange failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Token exchange failed: " + e.getMessage());
        }
    }

    @GetMapping("/loginInfo")
    public ResponseEntity<?> getJson(Authentication authentication) {
        log.info("controller commin");
        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                Map<String, Object> attributes = oAuth2User.getAttributes();
                return ResponseEntity.ok(attributes);
            } else {
                return ResponseEntity.ok("User is authenticated but not an OAuth2User");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
    }
    // TokenRequest와 TokenResponse 클래스 정의
    private static class TokenRequest {
        private String code;
        private String provider;
        // getters and setters
        public String getCode() {
            return code;
        }
        public String getProvider() {
            return provider;
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    private static class TokenResponse {
        private String accessToken;
        private String refreshToken;
    }
}



