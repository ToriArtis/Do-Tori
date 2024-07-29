package com.dotori.dotori.post.controller;

import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import com.dotori.dotori.post.dto.*;
import com.dotori.dotori.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Log4j2
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<PageResponseDTO<PostDTO>> listPosts(PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(postService.list(pageRequestDTO));
    }

    @PostMapping
    public ResponseEntity<PostDTO> addPost(@RequestBody PostDTO postDTO, @RequestParam(required = false) List<MultipartFile> files) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        postDTO.setEmail(email);

        Long postId = postService.addPost(postDTO, files);
        PostDTO addedPost = postService.getPost(postId);
        return ResponseEntity.ok(addedPost);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Long> likePost(@PathVariable Long id, @RequestBody ToriBoxDTO toriBoxDTO) throws Exception {
        return ResponseEntity.ok(postService.toriBoxPost(toriBoxDTO));
    }

    @GetMapping("/{id}/like")
    public ResponseEntity<Boolean> isLiked(@PathVariable Long id, @RequestParam Long aid) {
        return ResponseEntity.ok(postService.isLikedByUser(id, aid));
    }

    @GetMapping("/likes")
    public ResponseEntity<List<PostDTO>> getLikedPosts(@RequestParam Long aid) {
        return ResponseEntity.ok(postService.toriBoxSelectAll(aid));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long postId, @RequestBody CommentDTO commentDTO) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Not Found user email :" + email));

        commentDTO.setAid(user.getId());

        Long commentId = postService.registerComment(commentDTO, postId);
        CommentDTO addedComment = postService.readComment(commentId);
        return ResponseEntity.ok(addedComment);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<PageResponseDTO<CommentDTO>> listComments(@PathVariable Long postId, PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(postService.getListOfComment(postId, pageRequestDTO));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        postService.removeComment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostListCommentCountDTO>> searchPosts(@RequestParam String[] types, @RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(postService.searchWithCommentCount(types, keyword, pageable));
    }
}