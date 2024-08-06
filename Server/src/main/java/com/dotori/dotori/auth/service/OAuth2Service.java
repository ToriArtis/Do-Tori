package com.dotori.dotori.auth.service;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.entity.OAuthAttributes;
import com.dotori.dotori.auth.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationExchange;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationResponse;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
@RequiredArgsConstructor
public class OAuth2Service {

    private final ClientRegistrationRepository clientRegistrationRepository;
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    // OAuth2 인증 코드를 처리하고 OAuth2User를 반환
    public OAuth2User processCode(String code, String registrationId) {
        log.info("Processing code for provider: {}", registrationId);

        // 클라이언트 등록 정보 조회
        ClientRegistration clientRegistration = clientRegistrationRepository.findByRegistrationId(registrationId);
        if (clientRegistration == null) {
            log.error("Client registration not found for provider: {}", registrationId);
            throw new IllegalArgumentException("Invalid provider");
        }

        try {
            // OAuth2 인증 요청 및 응답 객체 생성
            OAuth2AuthorizationRequest authorizationRequest = OAuth2AuthorizationRequest.authorizationCode()
                    .clientId(clientRegistration.getClientId())
                    .authorizationUri(clientRegistration.getProviderDetails().getAuthorizationUri())
                    .redirectUri(clientRegistration.getRedirectUri())
                    .scopes(clientRegistration.getScopes())
                    .state("state")
                    .build();

            OAuth2AuthorizationResponse authorizationResponse = OAuth2AuthorizationResponse
                    .success(code)
                    .redirectUri(clientRegistration.getRedirectUri())
                    .state("state")
                    .build();

            // 인증 교환 요청 생성
            OAuth2AuthorizationCodeGrantRequest grantRequest =
                    new OAuth2AuthorizationCodeGrantRequest(clientRegistration,
                            new OAuth2AuthorizationExchange(authorizationRequest, authorizationResponse));

            // 액세스 토큰 요청
            DefaultAuthorizationCodeTokenResponseClient tokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
            OAuth2AccessTokenResponse tokenResponse = tokenResponseClient.getTokenResponse(grantRequest);

            // 액세스 토큰으로 사용자 정보를 요청
            DefaultOAuth2UserService userService = new DefaultOAuth2UserService();
            OAuth2UserRequest userRequest = new OAuth2UserRequest(clientRegistration, tokenResponse.getAccessToken());
            OAuth2User oAuth2User = userService.loadUser(userRequest);

            // OAuthAttributes 객체 생성 및 사용자 정보 저장/업데이트
            String userNameAttributeName = clientRegistration.getProviderDetails()
                    .getUserInfoEndpoint().getUserNameAttributeName();

            OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
            Auth auth = saveOrUpdate(attributes);

            // DefaultOAuth2User 객체 반환
            return new DefaultOAuth2User(
                    Collections.emptyList(),
                    attributes.getAttributes(),
                    attributes.getNameAttributeKey());
        } catch (Exception e) {
            log.error("Error processing OAuth2 code", e);
            throw e;
        }
    }

    // 사용자 정보를 저장하거나 업데이트
    public Auth saveOrUpdate(OAuthAttributes attributes) {
        Auth user = authRepository.findByEmail(attributes.getEmail())
                .map(entity -> entity.updateAuth(attributes.getName(), attributes.getEmail(), attributes.getProvider()))
                .orElseGet(() -> attributes.toEntity(passwordEncoder));

        return authRepository.save(user);
    }
}