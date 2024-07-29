package com.dotori.dotori.Follow.repository;

import com.dotori.dotori.Follow.entity.Follow;
import com.dotori.dotori.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // 팔로우 관계 확인
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    // 목록 조회
    Page<Follow> findByFollowing(User following, Pageable pageable);
    Page<Follow> findByFollower(User follower, Pageable pageable);

    // 팔로워 수 조회
    int countByFollowing(User following);

    // 팔로잉 수 조회
    int countByFollower(User follower);
    
}