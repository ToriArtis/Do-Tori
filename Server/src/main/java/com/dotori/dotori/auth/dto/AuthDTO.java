package com.dotori.dotori.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class AuthDTO {
    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class ResponseDTO {

        private Long id;
        @NotBlank private String email; // 사용자 이메일
        @NotBlank private String password; // 사용자 비밀번호
        @NotBlank private String nickName; // 사용자 닉네임
        @NotBlank private String phone; // 사용자 전화번호
        private String profileImage; // 프로필 이미지
        private String headerImage; // 헤더 이미지
        private String bio; // 사용자 한줄소개
    }

    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class LoginDTO{
        private String accessToken;
        private String refreshToken;
        private String provider;

        private Long id;
        @NotBlank private String email; // 사용자 이메일
        @NotBlank private String nickName; // 사용자 닉네임
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FindDTO{
        private String phone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MentionDTO {
        private Long id;
        private String nickName;
        private String profileImage;
    }
}
