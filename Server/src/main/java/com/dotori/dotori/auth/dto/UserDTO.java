package com.dotori.dotori.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

public class UserDTO {

    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class ResponseDTO {

        @NotBlank
        private String email; // 사용자 이메일
        @NotBlank private String password; // 사용자 비밀번호
        @NotBlank private String nickName; // 사용자 닉네임
        @NotBlank private String phone; // 사용자 전화번호
        private String profileImage; // 프로필 이미지
        private String headerImage; // 헤더 이미지
    }

    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class LoginDTO{
        private String token;
        private String provider;

        @NotBlank private String email; // 사용자 이메일
        @NotBlank private String nickName; // 사용자 닉네임
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FindDTO{
        private String phone;
    }
}
