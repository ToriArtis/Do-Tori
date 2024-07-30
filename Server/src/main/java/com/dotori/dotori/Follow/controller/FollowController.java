package com.dotori.dotori.Follow.controller;

import com.dotori.dotori.Follow.dto.FollowDTO;
import com.dotori.dotori.Follow.service.FollowService;
import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/follows")
public class FollowController {

    private final FollowService followService;
    private final UserService userService;

    // 팔로우
    @PostMapping("/{followingUserId}")
    public ResponseEntity<String> follow(@PathVariable Long followingUserId) {
        User currentUser = userService.getLoginUser();  // 현재 로그인한 사용자 정보 가져오기
        followService.follow(currentUser.getId(), followingUserId);
        return ResponseEntity.ok("팔로우 성공");
    }

    // 언팔로우
    @DeleteMapping("/{followingUserId}")
    public ResponseEntity<String> unfollow(@PathVariable Long followingUserId) {
        User currentUser = userService.getLoginUser();  // 현재 로그인한 사용자 정보 가져오기
        followService.unfollow(currentUser.getId(), followingUserId);
        return ResponseEntity.ok("언팔로우 성공");
    }

    // 팔로워 목록 조회
    @GetMapping("/{userId}/followers")
    public ResponseEntity<Page<FollowDTO>> getFollowers(
            @PathVariable Long userId, Pageable pageable) {
        Page<FollowDTO> followers = followService.getFollowers(userId, pageable);
        return ResponseEntity.ok(followers);
    }

    // 팔로잉 목록 조회
    @GetMapping("/{userId}/followings")
    public ResponseEntity<Page<FollowDTO>> getFollowings(
            @PathVariable Long userId, Pageable pageable) {
        Page<FollowDTO> followings = followService.getFollowings(userId, pageable);
        return ResponseEntity.ok(followings);
    }

    // 팔로워 수 조회
    @GetMapping("/{userId}/follower-count")
    public ResponseEntity<Long> getFollowerCount(@PathVariable Long userId) {
        long followerCount = followService.getFollowerCount(userId);
        return ResponseEntity.ok(followerCount);
    }

    // 팔로잉(내가 한 사람들) 수 조회
    @GetMapping("/{userId}/following-count")
    public ResponseEntity<Long> getFollowingCount(@PathVariable Long userId) {
        long followingCount = followService.getFollowingCount(userId);
        return ResponseEntity.ok(followingCount);
    }


}
