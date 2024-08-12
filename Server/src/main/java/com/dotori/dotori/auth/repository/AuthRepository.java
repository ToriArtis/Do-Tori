package com.dotori.dotori.auth.repository;

import com.dotori.dotori.auth.entity.Auth;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Auth, Long> {

    Optional<Auth> findByEmail(String email);
    Optional<Auth> findByNickName(String nickName);
    Optional<Auth> findByPhone(String phone);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phoneNumber);

    // 사용자 비번 업데이트 JPQL 쿼리 메서드
    @Modifying // 데이터 변경 쿼리임을 나타냄
    @Transactional
    @Query("UPDATE Auth u SET u.password = :password WHERE u.email = :email")
    int updatePassword(@Param("email") String email, @Param("password") String password);


}
