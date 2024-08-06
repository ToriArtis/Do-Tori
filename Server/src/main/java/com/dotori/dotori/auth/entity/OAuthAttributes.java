package com.dotori.dotori.auth.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@Getter
public class OAuthAttributes {
    private Map<String, Object> attributes;
    private String nameAttributeKey;
    private String name;
    private String email;
    private String provider;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes, String nameAttributeKey, String name, String email, String provider) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.provider = provider;
    }

    // OAuth 제공자에 따라 적절한 OAuthAttributes 객체 생성
    public static OAuthAttributes of(String registrationId, String userNameAttributeName, Map<String, Object> attributes) {
        if("naver".equals(registrationId)) {
            return ofNaver(userNameAttributeName, attributes);
        } else if ("kakao".equals(registrationId)) {
            return ofKakao("id", attributes);
        }
        return ofGoogle(userNameAttributeName, attributes);
    }

    // Google OAuth 정보로 OAuthAttributes 객체 생성
    private static OAuthAttributes ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .provider("google")
                .build();
    }

    // Naver OAuth 정보로 OAuthAttributes 객체 생성
    private static OAuthAttributes ofNaver(String userNameAttributeName, Map<String, Object> attributes) {
        log.debug("Naver attributes: {}", attributes);

        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        if (response == null) {
            log.error("Naver response is null. Using raw attributes.");
            response = attributes;
        }

        log.debug("Naver response: {}", response);

        String id = (String) response.get("id");
        String email = (String) response.get("email");
        String name = (String) response.get("name");

        log.debug("Naver id: {}, email: {}, name: {}", id, email, name);

        Map<String, Object> convertedAttributes = new HashMap<>(response);
        convertedAttributes.put("id", id);
        convertedAttributes.put("email", email);
        convertedAttributes.put("name", name);

        return OAuthAttributes.builder()
                .name(name)
                .email(email)
                .attributes(convertedAttributes)
                .nameAttributeKey("id")
                .provider("naver")
                .build();
    }

    // Kakao OAuth 정보로 OAuthAttributes 객체 생성
    private static OAuthAttributes ofKakao(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");

        return OAuthAttributes.builder()
                .name((String) kakaoProfile.get("nickname"))
                .email((String) kakaoAccount.get("email"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .provider("kakao")
                .build();
    }

    // OAuthAttributes 객체를 User 엔티티로 변환
    public Auth toEntity(PasswordEncoder passwordEncoder) {
        return Auth.builder()
                .email(email)
                .nickName(name)
                .provider(provider)
                .password(passwordEncoder.encode("1111"))  // 초기 비밀번호를 "1111"로 설정하고 인코딩
                .build();
    }
}