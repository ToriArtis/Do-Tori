package com.dotori.dotori.auth.repository;

import com.dotori.dotori.auth.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByNickName(String nickName);
    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);
    boolean existsByNickName(String nickName);
    boolean existsByPhone(String phoneNumber);

    // 사용자 비번 업데이트 JPQL 쿼리 메서드
    @Modifying // 데이터 변경 쿼리임을 나타냄
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.email = :email")
    int updatePassword(@Param("email") String email, @Param("password") String password);


}
