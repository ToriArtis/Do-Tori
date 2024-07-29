package com.dotori.dotori.auth.config.exception;

import lombok.Getter;

public enum ExceptionCode {

    USER_NOT_FOUND(404, "회원 정보를 찾을 수 없습니다."),
    EXIST_EMAIL(409,"이미 가입한 e-mail입니다."),
    EXIST_NICK_NAME(409,"이미 존재하는 닉네임입니다."),
    EXIST_PHONE_NUMBER(409,"이미 존재하는 연락처입니다."),
    NICKNAME_TOO_LONG(400, "닉네임은 5글자 이하여야 합니다."),
    SELF_FOLLOW_NOT_ALLOWED(400, "자기 자신은 팔로우할 수 없습니다."),
    ALREADY_FOLLOWING(400, "이미 팔로우한 사용자입니다."),
    FOLLOW_RELATIONSHIP_NOT_FOUND(404, "팔로우 관계가 존재하지 않습니다.");

    @Getter
    private int code;
    @Getter
    private String message;

    ExceptionCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
