package com.dotori.dotori.post.service;

import com.dotori.dotori.auth.dto.AuthDTO;
import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.repository.AuthRepository;
import com.dotori.dotori.auth.service.AuthService;
import com.dotori.dotori.follow.dto.FollowDTO;
import com.dotori.dotori.follow.service.FollowService;
import com.dotori.dotori.post.dto.*;
import com.dotori.dotori.post.entity.*;
import com.dotori.dotori.post.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ToriBoxRepository toriBoxRepository;
    private final AuthRepository authRepository;
    private final ModelMapper modelMapper;
    private final PostSearchImpl postSearchImpl;
    private final TagRepository tagRepository;
    private final BookmarkRepository bookmarkRepository;
    private final FollowService followService;
    private final PostLikeService postLikeService;
    private final AuthService authService;

    // 로그인한 사용자 조회
    private Auth getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return null; // 로그인하지 않은 사용자의 경우 null 반환
        }
        String email = authentication.getName();
        return authRepository.findByEmail(email)
                .orElse(null); // 사용자를 찾지 못한 경우에도 null 반환
    }
    // 특정 사용자가 게시글의 작성자인지 확인하는 메서드
    public boolean isPostAuthor(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Auth currentUser = authService.getLoginUser();
        return currentUser != null && post.getAuth().getId().equals(currentUser.getId());
    }

    // 특정 사용자가 댓글의 작성자인지 확인하는 메서드
    public boolean isCommentAuthor(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        Auth currentUser = authService.getLoginUser();
        return currentUser != null && comment.getAuth().getId().equals(currentUser.getId());
    }

    // Post 기능
    // 게시글 전체 목록
    public PageResponseDTO<PostDTO> list(PageRequestDTO pageRequestDTO) {
        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();
        Pageable pageable = pageRequestDTO.getPageable("pid");
        Page<Post> result = postRepository.searchAll(types, keyword, pageable);

        Auth loginAuth = getLoginUser();

        // 검색 결과의 게시글 리스트를 PostDTO 리스트로 변환
        List<PostDTO> postDTOS = result.getContent().stream()
                .map(post -> convertToPostDTO(post, loginAuth))
                .collect(Collectors.toList());

        // PostDTO 리스트에서 댓글 개수의 총합 계산
        int totalCommentCount = postDTOS.stream()
                .mapToInt(postDTO -> postDTO.getCommentCount().intValue())
                .sum();
        // PageResponseDTO 객체 생성
        PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .postLists(postDTOS)
                .total((int) result.getTotalElements())
                .build();

        // PageResponseDTO에 댓글 개수 총합과 현재 시간 설정
        pageResponseDTO.setCommentCount(totalCommentCount);
        pageResponseDTO.setCurrentTime(System.currentTimeMillis());

        return pageResponseDTO;
    }

    // 게시글 등록
    public Long addPost(PostDTO postDTO, List<MultipartFile> files) throws Exception {
        if (postDTO.getContent() == null || postDTO.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content cannot be null or empty");
        }
        Auth auth = getLoginUser();
        // PostDTO를 Post 엔티티로 변환
        Post post = modelMapper.map(postDTO, Post.class);
        // 변환된 Post 엔티티에 작성자 정보 설정
        post.setAuth(auth);
        post.setNickName(auth.getNickName());

        // 태그 처리
        if (postDTO.getTags() != null && !postDTO.getTags().isEmpty()) {
            // 태그 이름 리스트를 Tag 엔티티 리스트로 변환
            List<Tag> tags = postDTO.getTags().stream()
                    .map(tagName -> tagRepository.findByName(tagName)
                            .orElseGet(() -> tagRepository.save(new Tag(null, tagName, new ArrayList<>())))
                    )
                    .collect(Collectors.toList());
            // 변환된 Tag 엔티티 리스트를 Post 엔티티에 설정
            post.setTags(tags);
        }

        // 멘션 처리
        if (postDTO.getMentionedUsers() != null && !postDTO.getMentionedUsers().isEmpty()) {
            for (AuthDTO.MentionDTO mentionDTO : postDTO.getMentionedUsers()) {
                Auth mentionedUser = authRepository.findById(mentionDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Mentioned user not found with id: " + mentionDTO.getId()));
                post.addMention(mentionedUser);
            }
        }

        // 파일 처리 (기존 로직 유지)
        if (files != null && !files.isEmpty()) {
            // 첨부 파일 개수가 허용된 썸네일 개수를 초과하는 경우 예외 발생
            if (files.size() > postDTO.getThumbnailLimit()) {
                throw new Exception("Number of thumbnails exceeds the limit of " + postDTO.getThumbnailLimit());
            }
            // 첨부 파일을 업로드하고 PostThumbnail 엔티티 리스트 생성
            List<PostThumbnail> thumbnails = uploadImages(files, post);
            // 생성된 PostThumbnail 엔티티 리스트를 Post 엔티티의 썸네일 리스트에 추가
            post.getThumbnails().addAll(thumbnails);
        }

        Post savedPost = postRepository.save(post);
        postRepository.flush();
        return savedPost.getPid();
    }

    // 특정 게시글 조회 (로그인하지 않은 사용자도 조회 가능)
    public PostDTO getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        Auth loginAuth = getLoginUser();
        return convertToPostDTO(post, loginAuth);
    }

    // 게시글 수정
    public void modifyPost(PostDTO postDTO, List<MultipartFile> newFiles, List<String> retainedImages, List<String> deletedThumbnails) throws Exception {
        Post post = postRepository.findById(postDTO.getPid())
                .orElseThrow(() -> new Exception("Not Found post id: " + postDTO.getPid()));

        post.setContent(postDTO.getContent());

        // 삭제된 썸네일 처리
        if (deletedThumbnails != null && !deletedThumbnails.isEmpty()) {
            post.getThumbnails().removeIf(thumbnail -> deletedThumbnails.contains(thumbnail.getThumbnail()));
        }

        // 유지할 이미지만 남기기
        if (retainedImages != null && !retainedImages.isEmpty()) {
            post.getThumbnails().removeIf(thumbnail -> !retainedImages.contains(thumbnail.getThumbnail()));
        } else {
            post.getThumbnails().clear();
        }

        // 새 파일 추가
        if (newFiles != null && !newFiles.isEmpty()) {
            List<PostThumbnail> thumbnails = uploadImages(newFiles, post);
            post.getThumbnails().addAll(thumbnails);
        }

        // 태그 업데이트
        if (postDTO.getTags() != null && !postDTO.getTags().isEmpty()) {
            List<Tag> tags = postDTO.getTags().stream()
                    .map(tagName -> tagRepository.findByName(tagName)
                            .orElseGet(() -> tagRepository.save(new Tag(null, tagName, new ArrayList<>())))
                    )
                    .collect(Collectors.toList());
            post.setTags(tags);
        }

        // 멘션 업데이트
        post.getMentionedUsers().clear();
        if (postDTO.getMentionedUsers() != null && !postDTO.getMentionedUsers().isEmpty()) {
            for (AuthDTO.MentionDTO mentionDTO : postDTO.getMentionedUsers()) {
                Auth mentionedUser = authRepository.findById(mentionDTO.getId())
                        .orElseThrow(() -> new RuntimeException("Mentioned user not found with id: " + mentionDTO.getId()));
                post.addMention(mentionedUser);
            }
        }

        post.setModDate(LocalDateTime.now());
        postRepository.save(post);

        // 명시적으로 flush 호출
        postRepository.flush();
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        // 연관된 ToriBox 삭제
        toriBoxRepository.deleteByPost(post);

        // 연관된 Bookmark 삭제
        bookmarkRepository.deleteByPost(post);

        // 연관된 PostThumbnail 삭제
        post.getThumbnails().clear();

        // 연관된 Tag 관계 제거
        post.getTags().clear();

        // 게시글 삭제 (이때 cascade 옵션에 의해 연관된 Comment도 함께 삭제됨)
        postRepository.delete(post);

    }

    // 게시글 이미지 업로드
    private List<PostThumbnail> uploadImages(List<MultipartFile> files, Post post) throws Exception {
        List<PostThumbnail> thumbnails = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                String originalName = file.getOriginalFilename();
                if (originalName != null && !originalName.isEmpty()) {
                    // 파일명 생성
                    String fileName = System.currentTimeMillis() + "_" + originalName;
                    // 저장 경로 설정 (절대 경로 사용)
                    String savePath = System.getProperty("user.home") + "/dotori/images/";

                    // 로그 추가
                    log.info("Image save path: " + savePath);

                    // 폴더 없으면 생성
                    File saveDir = new File(savePath);
                    if (!saveDir.exists()) {
                        saveDir.mkdirs();
                    }
                    // 파일 저장
                    String filePath = savePath + fileName;
                    file.transferTo(new File(filePath));

                    // 로그 추가
                    log.info("Image saved at: " + filePath);

                    // 썸네일 엔티티 생성 및 설정
                    PostThumbnail postThumbnail = new PostThumbnail(fileName);
                    postThumbnail.setPost(post);
                    thumbnails.add(postThumbnail);
                }
            }
        }

        return thumbnails;
    }

    // ToriBox 기능
    // 좋아요 토글
    public boolean toriBoxPost(ToriBoxDTO toriBoxDTO) {
        return postLikeService.toriBoxPost(toriBoxDTO);
    }

    // 특정 사용자의 좋아요 모아보기
    public List<PostDTO> toriBoxSelectAll(Long aid) {
        List<ToriBox> toriBoxList = toriBoxRepository.findByAid(aid);
        Auth loginAuth = getLoginUser();
        // 조회한 ToriBox 엔티티 리스트를 PostDTO 리스트로 변환하여 반환
        return toriBoxList.stream()
                .map(toriBox -> convertToPostDTO(toriBox.getPost(), loginAuth))
                .collect(Collectors.toList());
    }

    // 좋아요 수 조회
    public long getLikeCount(Long postId) {
        return postLikeService.countLikes(postId);
    }

    // 북마크 기능
    // 북마크 토글
    public boolean bookmarkPost(Long postId) {
        Auth auth = getLoginUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Not Found post id :" + postId));

        // 사용자와 게시글로 기존의 북마크 조회
        Optional<Bookmark> existingBookmark = bookmarkRepository.findByAuth_IdAndPost(auth.getId(), post);

        if (existingBookmark.isPresent()) {
            // 이미 북마크가 존재하면 북마크 삭제
            bookmarkRepository.delete(existingBookmark.get());
            return false;
        } else {
            // 북마크가 없으면 새로운 북마크 생성 및 저장
            Bookmark bookmark = Bookmark.builder().post(post).auth(auth).build();
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    // 북마크 모아보기
    public List<PostDTO> getBookmarkedPosts() {
        Auth auth = getLoginUser();
        List<Bookmark> bookmarks = bookmarkRepository.findByAuth(auth);
        // 북마크 리스트를 PostDTO 리스트로 변환하여 반환
        return bookmarks.stream()
                .map(bookmark -> convertToPostDTO(bookmark.getPost(), auth))
                .collect(Collectors.toList());
    }

    // 북마크 수 조회
    public long getBookmarkCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return bookmarkRepository.countByPost(post);
    }

    // Comment 기능
    // 댓글 목록 조회
    public PageResponseDTO<CommentDTO> getListOfComment(Long postId, PageRequestDTO pageRequestDTO) {
        Pageable pageable = pageRequestDTO.getPageable("id");
        Page<Comment> result = commentRepository.listOfPost(postId, pageable);

        List<CommentDTO> dtoList = result.getContent().stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList());

        return PageResponseDTO.<CommentDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .postLists(dtoList)
                .total((int) result.getTotalElements())
                .build();
    }

    // 댓글 등록
    public CommentDTO registerComment(CommentDTO commentDTO, Long postId) {
        Auth auth = getLoginUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .content(commentDTO.getContent())
                .post(post)
                .auth(auth)
                .nickName(auth.getNickName())
                .regDate(LocalDateTime.now())
                .build();

        if (commentDTO.getParentId() != null) {
            Comment parent = commentRepository.findById(commentDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }

        Comment savedComment = commentRepository.save(comment);

        CommentDTO savedCommentDTO = modelMapper.map(savedComment, CommentDTO.class);
        savedCommentDTO.setAid(auth.getId());
        savedCommentDTO.setNickName(auth.getNickName());

        return savedCommentDTO;
    }

    // 특정 댓글 조회
    public CommentDTO readComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Comment 엔티티를 CommentDTO로 변환
        CommentDTO dto = modelMapper.map(comment, CommentDTO.class);

        // 작성자 정보가 존재하면 CommentDTO에 설정
        if (comment.getAuth() != null) {
            dto.setAid(comment.getAuth().getId());
            dto.setNickName(comment.getAuth().getNickName());
            dto.setProfileImage(comment.getAuth().getProfileImage());
        }

        // 부모 댓글이 존재하면 부모 댓글의 ID를 CommentDTO에 설정
        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
        return dto;
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + id));

        // 대댓글이 있는 경우 모두 삭제
//        comment.getChildren().clear();
        comment.setContent("삭제된 댓글입니다.");

        // 댓글 삭제
        commentRepository.save(comment);
    }

    // Search 기능
    // 검색 기능
    public Page<Post> searchAll(String[] types, String keyword, Pageable pageable) {
        // 검색 타입, 키워드, 페이징 객체로 검색
        return postSearchImpl.searchAll(types, keyword, pageable);
    }

    // 댓글 개수와 함께 나오는 게시물 검색 기능
    public Page<PostListCommentCountDTO> searchWithCommentCount(String[] types, String keyword, Pageable pageable) {
        // 검색 타입, 키워드, 페이징 객체로 검색 (댓글 개수 포함)
        return postSearchImpl.searchWithCommentCount(types, keyword, pageable);
    }

    // 기타 기능
    // 내가 쓴 글 모아보기
    public List<PostDTO> getPostsByAuthId(Long authId) {
        List<Post> posts = postRepository.findByAuth_Id(authId);
        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return posts.stream()
                .map(post -> convertToPostDTO(post, auth))
                .collect(Collectors.toList());
    }

    // 내가 쓴 댓글 모아보기
    public List<CommentDTO> getCommentsByAuthId() {
        Auth auth = getLoginUser();
        List<Comment> comments = commentRepository.findByAuth_Id(auth.getId());
        // 조회한 댓글 리스트를 CommentDTO 리스트로 변환하여 반환
        return comments.stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList());
    }

    // 팔로잉한 사람 게시글 모아보기
    public List<PostDTO> getPostsByFollowing() {
        Auth auth = getLoginUser();

        // 사용자가 팔로잉한 사람들의 리스트 조회
        List<FollowDTO> followings = followService.getFollowings(auth.getId(), Pageable.unpaged()).getContent();

        // 팔로잉한 사람들의 사용자 ID 리스트 추출
        List<Long> followingIds = followings.stream()
                .map(FollowDTO::getUserId)
                .collect(Collectors.toList());

        // 팔로잉한 사람들이 작성한 게시글 리스트 조회
        List<Post> posts = postRepository.findByAuthIdIn(followingIds);

        // 조회한 게시글 리스트를 PostDTO 리스트로 변환하여 반환
        return posts.stream()
                .map(post -> convertToPostDTO(post, auth))
                .collect(Collectors.toList());
    }

    // 베스트 게시글
    public List<PostDTO> getTopPostsByToriBoxCount() {
        // 페이징 객체 생성 (첫 페이지, 사이즈 3)
        Pageable pageable = PageRequest.of(0, 3);
        // 좋아요 수가 많은 상위 게시글 가져오기
        Page<Post> topPosts = postRepository.findTopPostsByToriBoxCount(pageable);

        // 로그인한 사용자 정보 가져오기
        Auth loginAuth = getLoginUser();

        return topPosts.getContent().stream()
                .map(post -> convertToPostDTO(post, loginAuth))
                .collect(Collectors.toList());
    }

    // Post 엔티티를 PostDTO로 변환하는 메서드 (로그인하지 않은 사용자 고려)
    private PostDTO convertToPostDTO(Post post, Auth loginAuth) {
        // Post 엔티티를 PostDTO로 매핑
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);

        // 작성자 정보가 존재하면 PostDTO에 설정
        if (post.getAuth() != null) {
            postDTO.setAid(post.getAuth().getId());  // aid 설정
            postDTO.setNickName(post.getAuth().getNickName());
            postDTO.setProfileImage(post.getAuth().getProfileImage());
        }

        // 좋아요 수, 북마크 수, 댓글 수 설정
        postDTO.setToriBoxCount(postLikeService.countLikes(post.getPid()));
        postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(post));
        postDTO.setCommentCount(commentRepository.countByPost(post));
        // 썸네일 정보 설정
        postDTO.setThumbnails(post.getThumbnails().stream()
                .map(PostThumbnail::getThumbnail)
                .collect(Collectors.toList()));

        // 로그인한 사용자인 경우에만 좋아요와 북마크 여부 설정
        if (loginAuth != null) {
            postDTO.setLiked(postLikeService.isLikedByUser(post.getPid(), loginAuth.getId()));
            postDTO.setBookmarked(postLikeService.isBookmarkedByUser(loginAuth.getId(), post.getPid()));
        } else {
            // 로그인하지 않은 사용자의 경우 false로 설정
            postDTO.setLiked(false);
            postDTO.setBookmarked(false);
        }

        // 태그 정보 처리
        if (post.getTags() != null && !post.getTags().isEmpty()) {
            postDTO.setTags(post.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toList()));
        }

        postDTO.setMentionedUsers(post.getMentionedUsers().stream()
                .map(auth -> new AuthDTO.MentionDTO(auth.getId(), auth.getNickName(), auth.getProfileImage()))
                .collect(Collectors.toList()));

        return postDTO;
    }

    // Comment 엔티티를 CommentDTO로 변환하는 메서드
    private CommentDTO convertToCommentDTO(Comment comment) {
        CommentDTO dto = modelMapper.map(comment, CommentDTO.class);

        if (comment.getAuth() != null) {
            dto.setAid(comment.getAuth().getId());
            dto.setNickName(comment.getAuth().getNickName());
            dto.setProfileImage(comment.getAuth().getProfileImage());
        }

        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);

        return dto;
    }

}