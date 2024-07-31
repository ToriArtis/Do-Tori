package com.dotori.dotori.auth.entity;

import lombok.Getter;

public enum AuthStatus {

    AUTH_ACTIVE("활동 중"),       // 사용자 상태: 활동 중
    AUTH_WITHDRAWAL("회원 탈퇴");  // 사용자 상태: 회원 탈퇴

    @Getter
    private String status;

    AuthStatus(String status ){
        this.status = status;
    }

}
