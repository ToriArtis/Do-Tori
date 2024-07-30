package com.dotori.dotori.follow.service;

import com.dotori.dotori.follow.dto.FollowDTO;
import com.dotori.dotori.follow.entity.Follow;
import com.dotori.dotori.follow.repository.FollowRepository;
import com.dotori.dotori.auth.config.exception.BusinessLogicException;
import com.dotori.dotori.auth.config.exception.ExceptionCode;
import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    // 팔로우
    public void follow(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        // 자기 자신 팔로우XX
        if (followerId.equals(followingId)) {
            throw new BusinessLogicException(ExceptionCode.SELF_FOLLOW_NOT_ALLOWED);
        }

        // 이미 팔로우한 경우 예외 처리
        if (followRepository.findByFollowerAndFollowing(follower, following).isPresent()) {
            throw new BusinessLogicException(ExceptionCode.ALREADY_FOLLOWING);
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(follow);
    }

    // 언팔로우
    @Transactional
    public void unfollow(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.FOLLOW_RELATIONSHIP_NOT_FOUND));

        followRepository.delete(follow);
    }

    // 팔로워 목록 조회
    public Page<FollowDTO> getFollowers(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        Page<Follow> followers = followRepository.findByFollowing(user, pageable);
        return followers.map(follow -> new FollowDTO(
                follow.getFollower().getId(),
                follow.getFollower().getNickName(),
                follow.getFollower().getProfileImage()
        ));
    }

    // 팔로잉 목록 조회
    public Page<FollowDTO> getFollowings(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

        Page<Follow> followings = followRepository.findByFollower(user, pageable);
        return followings.map(follow -> new FollowDTO(
                follow.getFollowing().getId(),
                follow.getFollowing().getNickName(),
                follow.getFollowing().getProfileImage()
        ));
    }

    // 팔로워 수 조회
    public long getFollowerCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        return followRepository.countByFollowing(user);
    }

    // 팔로잉 수 조회
    public long getFollowingCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        return followRepository.countByFollower(user);
    }

}
