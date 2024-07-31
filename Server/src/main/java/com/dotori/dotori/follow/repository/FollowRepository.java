package com.dotori.dotori.follow.repository;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.follow.entity.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // 팔로우 관계 확인
    Optional<Follow> findByFollowerAndFollowing(Auth follower, Auth following);

    // 목록 조회
    Page<Follow> findByFollowing(Auth following, Pageable pageable);
    Page<Follow> findByFollower(Auth follower, Pageable pageable);

    // 팔로워 수 조회
    int countByFollowing(Auth following);

    // 팔로잉 수 조회
    int countByFollower(Auth follower);
    
}