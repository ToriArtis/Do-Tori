package com.dotori.dotori.auth.entity;

import com.dotori.dotori.Follow.entity.Follow;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "nick_name", length = 20)
    private String nickName;

    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "provider")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "header_image")
    private String headerImage;

    // 팔로워 리스트
    @OneToMany(mappedBy = "following", cascade = CascadeType.ALL)
    private List<Follow> followers = new ArrayList<>();

    // 팔로잉 리스트
    @OneToMany(mappedBy = "follower", cascade = CascadeType.ALL)
    private List<Follow> followings = new ArrayList<>();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private UserStatus userStatus = UserStatus.USER_ACTIVE; // 기본값을 USER_ACTIVE로 설정

    public User updateUser(String email, String provider) {
        this.email = email;
        this.provider = provider;
        return this;
    }

}