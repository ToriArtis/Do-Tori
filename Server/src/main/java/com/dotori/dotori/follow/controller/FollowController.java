package com.dotori.dotori.follow.controller;

import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.follow.dto.FollowDTO;
import com.dotori.dotori.follow.service.FollowService;
import com.dotori.dotori.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/follows")
public class FollowController {

    private final FollowService followService;
    private final AuthService authService;

    // 팔로우
    @PostMapping("/{userId}")
    public ResponseEntity<?> follow(@PathVariable Long userId) {
        try {
            Auth currentAuth = authService.getLoginUser();
            if (currentAuth.getId().equals(userId)) {
                return ResponseEntity.badRequest().body("{\"message\":\"자기 자신을 팔로우할 수 없습니다.\"}");
            }
            followService.follow(currentAuth.getId(), userId);
            return ResponseEntity.ok().body("{\"message\":\"success\"}");
        } catch (BusinessLogicException e) {
            return ResponseEntity.status(e.getExceptionCode().getCode()).body("{\"message\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\":\"서버 오류가 발생했습니다.\"}");
        }
    }

    // 언팔로우
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollow(@PathVariable Long userId) {
        try {
            Auth currentAuth = authService.getLoginUser();
            followService.unfollow(currentAuth.getId(), userId);
            return ResponseEntity.ok().body("{\"message\":\"success\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\":\"서버 오류가 발생했습니다.\"}");
        }
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
