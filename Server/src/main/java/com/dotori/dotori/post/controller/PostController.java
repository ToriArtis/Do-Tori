package com.dotori.dotori.post.controller;

import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import com.dotori.dotori.auth.service.UserService;
import com.dotori.dotori.post.dto.*;
import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.service.PostLikeService;
import com.dotori.dotori.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Log4j2
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    private final PostLikeService postLikeService;

    // 로그인한 사용자 조회
    private User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));
    }

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<PageResponseDTO<PostDTO>> listPosts(PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(postService.list(pageRequestDTO));
    }

    // 게시글 등록
    @PostMapping
    public ResponseEntity<PostDTO> addPost(@RequestBody PostDTO postDTO, @RequestParam(required = false) List<MultipartFile> files) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        postDTO.setEmail(email);

        Long postId = postService.addPost(postDTO, files);
        PostDTO addedPost = postService.getPost(postId);
        return ResponseEntity.ok(addedPost);
    }

    // 특정 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> modifyPost(@PathVariable Long id, @RequestBody PostDTO postDTO,
                                              @RequestParam(required = false) List<MultipartFile> files,
                                              @RequestParam(required = false) List<String> deletedThumbnails) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        postDTO.setEmail(email);

        postDTO.setPid(id);
        postService.modifyPost(postDTO, files, deletedThumbnails);
        PostDTO modifiedPost = postService.getPost(id);
        return ResponseEntity.ok(modifiedPost);
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    // 게시글 좋아요
    @PostMapping("/{id}/like")
    public ResponseEntity<Boolean> likePost(@PathVariable Long id) {
        User loginUser = getLoginUser();

        ToriBoxDTO toriBoxDTO = ToriBoxDTO.builder()
                .aid(loginUser.getId())
                .pid(id)
                .build();
        boolean isLiked = postService.toriBoxPost(toriBoxDTO);
        return ResponseEntity.ok(isLiked);
    }

    // 게시글 좋아요 여부 확인
    @GetMapping("/{id}/like")
    public ResponseEntity<Boolean> isLiked(@PathVariable Long id) {
        User loginUser = getLoginUser();
        return ResponseEntity.ok(postLikeService.isLikedByUser(id, loginUser.getId()));
    }

    // 좋아요한 게시글 목록 조회
    @GetMapping("/likes")
    public ResponseEntity<List<PostDTO>> getLikedPosts() {
        User loginUser = getLoginUser();
        return ResponseEntity.ok(postService.toriBoxSelectAll(loginUser.getId()));
    }

    // 게시글 북마크
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<Boolean> bookmarkPost(@PathVariable Long id) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        boolean isBookmarked = postService.bookmarkPost(email, id);
        return ResponseEntity.ok(isBookmarked);
    }

    // 북마크한 게시글 목록 조회
    @GetMapping("/bookmarks")
    public ResponseEntity<List<PostDTO>> getBookmarkedPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(postService.getBookmarkedPosts(email));
    }

    // 좋아요 수가 많은 상위 게시글 조회
    @GetMapping("/best")
    public ResponseEntity<List<PostDTO>> getTopPostsByToriBoxCount() {
        List<PostDTO> topPosts = postService.getTopPostsByToriBoxCount();
        return ResponseEntity.ok(topPosts);
    }

    // 댓글 등록
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long postId, @RequestBody CommentDTO commentDTO) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // commentDTO에 이메일 설정
        commentDTO.setEmail(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Not Found user email :" + email));

        Long commentId = postService.registerComment(commentDTO, postId);
        CommentDTO addedComment = postService.readComment(commentId);
        return ResponseEntity.ok(addedComment);
    }

    // 댓글 목록 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<PageResponseDTO<CommentDTO>> listComments(@PathVariable Long postId, PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(postService.getListOfComment(postId, pageRequestDTO));
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        postService.removeComment(id);
        return ResponseEntity.ok().build();
    }

    // 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Page<PostListCommentCountDTO>> searchPosts(@RequestParam String[] types, @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(postService.searchWithCommentCount(types, keyword, pageable));
    }

    // 내가 쓴 글 모아보기
    @GetMapping("/me")
    public ResponseEntity<List<PostDTO>> getMyPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(postService.getPostsByEmail(email));
    }

    // 내가 쓴 댓글 모아보기
    @GetMapping("/me/comments")
    public ResponseEntity<List<CommentDTO>> getMyComments() {
        User loginUser = userService.getLoginUser();
        return ResponseEntity.ok(postService.getCommentsByEmail(loginUser.getEmail()));
    }

    // 팔로잉한 사용자의 게시글 모아보기
    @GetMapping("/following")
    public ResponseEntity<List<PostDTO>> getFollowingPosts() {
        User loginUser = userService.getLoginUser();
        return ResponseEntity.ok(postService.getPostsByFollowing(loginUser.getEmail()));
    }
}