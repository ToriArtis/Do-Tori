package com.dotori.dotori.post.controller;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.service.AuthService;
import com.dotori.dotori.post.dto.*;
import com.dotori.dotori.post.service.PostLikeService;
import com.dotori.dotori.post.service.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Log4j2
public class PostController {

    private final PostService postService;
    private final AuthService authService;
    private final PostLikeService postLikeService;

    // 전체 post 목록 (로그인 불필요)
    @GetMapping
    public ResponseEntity<PageResponseDTO<PostDTO>> listPosts(PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(postService.list(pageRequestDTO));
    }

    // 게시글 등록 (로그인 필요)
    @PostMapping
    public ResponseEntity<PostDTO> addPost(
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) throws Exception {

        PostDTO postDTO = new PostDTO();
        postDTO.setContent(content);
        if (tags != null && !tags.isEmpty()) {
            postDTO.setTags(tags);
        } else {
            postDTO.setTags(new ArrayList<>()); // 태그가 없을 경우 빈 리스트 설정
        }
        Long postId = postService.addPost(postDTO, files);
        PostDTO addedPost = postService.getPost(postId);
        return ResponseEntity.ok(addedPost);
    }

    // 특정 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    // 게시글 수정 (작성자만 가능)
    @PreAuthorize("isAuthenticated() and @postService.isPostAuthor(#id, authentication.name)")
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> modifyPost(
            @PathVariable Long id,
            @RequestParam("postDTO") String postDTOString,
            @RequestParam(value = "newFiles", required = false) List<MultipartFile> newFiles,
            @RequestParam(value = "retainedImages", required = false) List<String> retainedImages,
            @RequestParam(value = "deletedThumbnails", required = false) List<String> deletedThumbnails
    ) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        PostDTO postDTO = objectMapper.readValue(postDTOString, PostDTO.class);
        postDTO.setPid(id);

        postService.modifyPost(postDTO, newFiles, retainedImages, deletedThumbnails);
        PostDTO modifiedPost = postService.getPost(id);
        return ResponseEntity.ok(modifiedPost);
    }

    // 게시글 삭제 (작성자만 가능)
    @PreAuthorize("isAuthenticated() and @postService.isPostAuthor(#id, authentication.name)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    // 게시글 좋아요 (로그인 필요)
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> likePost(@PathVariable Long id) {
        Auth loginAuth = authService.getLoginUser();
        ToriBoxDTO toriBoxDTO = ToriBoxDTO.builder()
                .aid(loginAuth.getId())
                .pid(id)
                .build();
        boolean isLiked = postService.toriBoxPost(toriBoxDTO);
        long likeCount = postService.getLikeCount(id);
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        response.put("likeCount", likeCount);
        return ResponseEntity.ok(response);
    }

    // 게시글 좋아요 여부 확인
    @GetMapping("/{id}/like")
    public ResponseEntity<Boolean> isLiked(@PathVariable Long id) {
        Auth loginAuth = authService.getLoginUser();
        return ResponseEntity.ok(postLikeService.isLikedByUser(id, loginAuth.getId()));
    }

    // 좋아요한 게시글 목록 조회
    @GetMapping("/likes")
    public ResponseEntity<List<PostDTO>> getLikedPosts() {
        Auth loginAuth = authService.getLoginUser();
        return ResponseEntity.ok(postService.toriBoxSelectAll(loginAuth.getId()));
    }

    // 게시글 북마크 (로그인 필요)
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<Map<String, Object>> bookmarkPost(@PathVariable Long id) {
        boolean isBookmarked = postService.bookmarkPost(id);
        long bookmarkCount = postService.getBookmarkCount(id);
        Map<String, Object> response = new HashMap<>();
        response.put("isBookmarked", isBookmarked);
        response.put("bookmarkCount", bookmarkCount);
        return ResponseEntity.ok(response);
    }

    // 북마크한 게시글 목록 조회
    @GetMapping("/bookmarks")
    public ResponseEntity<List<PostDTO>> getBookmarkedPosts() {
        return ResponseEntity.ok(postService.getBookmarkedPosts());
    }

    // 좋아요 수가 많은 상위 게시글 조회
    @GetMapping("/best")
    public ResponseEntity<List<PostDTO>> getTopPostsByToriBoxCount() {
        List<PostDTO> topPosts = postService.getTopPostsByToriBoxCount();
        return ResponseEntity.ok(topPosts);
    }

    // 댓글 등록 (로그인 필요)
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long postId, @RequestBody CommentDTO commentDTO) {
        CommentDTO savedCommentDTO = postService.registerComment(commentDTO, postId);
        log.info("Returned comment DTO: {}", savedCommentDTO);  // 로그 추가
        return ResponseEntity.ok(savedCommentDTO);
    }

    // 댓글 목록 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<PageResponseDTO<CommentDTO>> listComments(@PathVariable Long postId, PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(postService.getListOfComment(postId, pageRequestDTO));
    }

    // 댓글 삭제 (작성자만 가능)
    @PreAuthorize("isAuthenticated() and @postService.isCommentAuthor(#id, authentication.name)")
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        postService.deleteComment(id);
        return ResponseEntity.ok().build();
    }

    // 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Page<PostListCommentCountDTO>> searchPosts(@RequestParam String[] types, @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(postService.searchWithCommentCount(types, keyword, pageable));
    }

    // 내가 쓴 글 모아보기 (로그인 필요)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<List<PostDTO>> getMyPosts() {
        Auth loginAuth = authService.getLoginUser();
        return ResponseEntity.ok(postService.getPostsByAuthId(loginAuth.getId()));
    }

    // 내가 쓴 댓글 모아보기 (로그인 필요)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/comments")
    public ResponseEntity<List<CommentDTO>> getMyComments() {
        return ResponseEntity.ok(postService.getCommentsByAuthId());
    }

    // 팔로잉한 사용자의 게시글 모아보기 (로그인 필요)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/following")
    public ResponseEntity<List<PostDTO>> getFollowingPosts() {
        return ResponseEntity.ok(postService.getPostsByFollowing());
    }
}