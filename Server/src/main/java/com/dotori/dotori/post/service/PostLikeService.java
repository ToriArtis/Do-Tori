package com.dotori.dotori.post.service;

import com.dotori.dotori.auth.repository.AuthRepository;
import com.dotori.dotori.post.dto.ToriBoxDTO;
import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.entity.ToriBox;
import com.dotori.dotori.post.repository.BookmarkRepository;
import com.dotori.dotori.post.repository.PostRepository;
import com.dotori.dotori.post.repository.ToriBoxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostLikeService {
    private final ToriBoxRepository toriBoxRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final AuthRepository authRepository;

    // 특정 사용자가 게시글에 좋아요를 눌렀는지 확인
    public boolean isLikedByUser(Long pid, Long aid) {
        Post post = postRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return toriBoxRepository.findByAidAndPost(aid, post).isPresent();
    }

    // 특정 사용자가 게시글을 북마크했는지 확인
    public boolean isBookmarkedByUser(Long authId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Not Found post id: " + postId));
        return bookmarkRepository.findByAuth_IdAndPost(authId, post).isPresent();
    }

    // 게시글의 좋아요 개수 조회
    public Long countLikes(Long pid) {
        Post post = postRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return (long) toriBoxRepository.countByPost(post);
    }

    // 게시글 좋아요 토글 기능
    public boolean toriBoxPost(ToriBoxDTO toriBoxDTO) {
//        Auth auth = authRepository.findById(toriBoxDTO.getAid())
//                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(toriBoxDTO.getPid())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 사용자와 게시글로 기존의 좋아요 조회
        Optional<ToriBox> existingLike = toriBoxRepository.findByAidAndPost(toriBoxDTO.getAid(), post);

        if (existingLike.isPresent()) {
            // 이미 좋아요가 존재하면 좋아요 취소
            toriBoxRepository.delete(existingLike.get());
            return false;
        } else {
            // 좋아요가 없으면 새로운 좋아요 생성 및 저장
            ToriBox toriBox = ToriBox.builder()
                    .post(post)
                    .aid(toriBoxDTO.getAid())
                    .build();
            toriBoxRepository.save(toriBox);
            return true;
        }
    }
}