package com.dotori.dotori.post.service;

import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import com.dotori.dotori.follow.dto.FollowDTO;
import com.dotori.dotori.follow.repository.FollowRepository;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ToriBoxRepository toriBoxRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PostSearchImpl postSearchImpl;
    private final TagRepository tagRepository;
    private final BookmarkRepository bookmarkRepository;
    private final FollowRepository followRepository;
    private final FollowService followService;
    private final PostLikeService postLikeService;

    // 로그인한 사용자 조회
    private User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));
    }

    // Post 기능
    // 게시글 전체 목록
    public PageResponseDTO<PostDTO> list(PageRequestDTO pageRequestDTO) {
        // 검색 타입과 키워드 가져오기
        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();

        // 페이징
        Pageable pageable = pageRequestDTO.getPageable("pid");

        // 검색 조건에 맞는 게시글 목록 가져오기
        Page<Post> result = postRepository.searchAll(types, keyword, pageable);

        // 로그인한 사용자 정보 가져오기
        User loginUser = getLoginUser();

        // 게시글 엔티티 목록을 DTO 목록으로 변환
        List<PostDTO> postDTOS = result.getContent().stream()
                .map(post -> convertToPostDTO(post, loginUser))
                .collect(Collectors.toList());

        // 총 댓글 수 계산
        int totalCommentCount = postDTOS.stream()
                .mapToInt(postDTO -> postDTO.getCommentCount().intValue())
                .sum();

        // 페이지 응답 DTO 생성
        PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .postLists(postDTOS)
                .total((int) result.getTotalElements())
                .build();

        // 페이지 응답 DTO에 총 댓글 수와 현재 시간 설정
        pageResponseDTO.setCommentCount(totalCommentCount);
        pageResponseDTO.setCurrentTime(System.currentTimeMillis());

        return pageResponseDTO;
    }

    // 게시글 등록
    public Long addPost(PostDTO postDTO, List<MultipartFile> files) throws Exception {
        // 사용자 정보 조회
        User user = userRepository.findByEmail(postDTO.getEmail())
                .orElseThrow(() -> new Exception("Not Found user email: " + postDTO.getEmail()));

        // PostDTO를 Post 엔티티로 변환
        Post post = modelMapper.map(postDTO, Post.class);
        // 게시글에 작성자 정보 설정
        post.setUser(user);
        post.setNickName(user.getNickName());

        // 태그 리스트 설정
        List<Tag> tags = new ArrayList<>();
        for (String tagName : postDTO.getTags()) {
            // 태그 이름으로 태그 조회, 없을 경우 새로운 태그 생성
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(null, tagName, new ArrayList<>())));
            tags.add(tag);
        }
        // 게시글에 태그 리스트 설정
        post.setTags(tags);

        // 첨부 파일이 있는 경우
        if (files != null && !files.isEmpty()) {
            // 첨부파일 개수가 허용된 썸네일 개수를 초과하는 경우 예외 발생
            if (files.size() > postDTO.getThumbnailLimit()) {
                throw new Exception("Number of thumbnails exceeds the limit of " + postDTO.getThumbnailLimit());
            }

            // 첨부 파일 업로드 및 썸네일 생성
            List<PostThumbnail> thumbnails = uploadImages(files, post);
            // 게시글에 썸네일 리스트 추가
            post.getThumbnails().addAll(thumbnails);
        }

        return postRepository.save(post).getPid();
    }

    // 특정 게시글 조회
    public PostDTO getPost(Long id) {
        Post result = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        // 로그인한 사용자 정보 가져오기
        User loginUser = getLoginUser();

        return convertToPostDTO(result, loginUser);
    }

    // 게시글 수정
    public void modifyPost(PostDTO postDTO, List<MultipartFile> files, List<String> deletedThumbnails) throws Exception {
        Post post = postRepository.findById(postDTO.getPid())
                .orElseThrow(() -> new Exception("Not Found post id: " + postDTO.getPid()));
        User user = userRepository.findByEmail(postDTO.getEmail())
                .orElseThrow(() -> new Exception("Not Found user email: " + postDTO.getEmail()));

        // 게시글의 닉네임과 사용자의 닉네임이 다르면 업데이트
        if (post.getNickName() == null || !post.getNickName().equals(user.getNickName())) {
            post.setNickName(user.getNickName());
        }

        // 삭제된 썸네일이 있다면 게시글의 썸네일에서 제거
        if (deletedThumbnails != null && !deletedThumbnails.isEmpty()) {
            post.getThumbnails().removeIf(thumbnail -> deletedThumbnails.contains(thumbnail.getThumbnail()));
        }

        // 새로 추가된 파일이 있다면 업로드하고 게시글의 썸네일에 추가
        if (files != null && !files.isEmpty()) {
            List<PostThumbnail> thumbnails = uploadImages(files, post);
            post.getThumbnails().addAll(thumbnails);
        }

        // 태그가 있다면 태그 업데이트
        if (postDTO.getTags() != null && !postDTO.getTags().isEmpty()) {
            List<Tag> tags = new ArrayList<>();
            for (String tagName : postDTO.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(new Tag(null, tagName, new ArrayList<>())));
                tags.add(tag);
            }
            post.setTags(tags);
        }

        post.changePost(postDTO.getContent(), LocalDateTime.now(), post.getThumbnails());
        postRepository.save(post);
    }

    // 게시글 삭제
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // post 엔티티를 postdto로 변환하는 기능
    private PostDTO convertToPostDTO(Post post, User loginUser) {
        // post 엔티티를 postDTO로 매핑
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        // 사용자 정보 설정
        postDTO.setNickName(post.getUser().getNickName());
        postDTO.setProfileImage(post.getUser().getProfileImage());
        postDTO.setEmail(post.getUser().getEmail());
        // 좋아요, 북마크 댓글 수 설정
        postDTO.setToriBoxCount(postLikeService.countLikes(post.getPid()));
        postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(post));
        postDTO.setCommentCount(commentRepository.countByPost(post));
        // 로그인 한 사용자의 좋아요, 북마크 여부 설정
        postDTO.setLiked(postLikeService.isLikedByUser(post.getPid(), loginUser.getId()));
        postDTO.setBookmarked(postLikeService.isBookmarkedByUser(loginUser.getEmail(), post.getPid()));
        // 등록일, 수정일 설정
        postDTO.setRegDate(post.getRegDate());
        postDTO.setModDate(post.getModDate());

        // 태그 이름 리스트 설정
        List<String> tagNames = post.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        postDTO.setTags(tagNames);

        // 썸네일 리스트 설정
        List<String> thumbnails = post.getThumbnails().stream()
                .map(PostThumbnail::getThumbnail)
                .collect(Collectors.toList());
        postDTO.setThumbnails(thumbnails);

        return postDTO;
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
                    // 저장 경로 설정
                    String savePath = System.getProperty("user.dir") + "/Server/src/main/resources/static/images/";
                    // 폴더 없으면 생성
                    if (!new File(savePath).exists()) {
                        new File(savePath).mkdir();
                    }
                    // 파일 저장
                    String filePath = savePath + fileName;
                    file.transferTo(new File(filePath));
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
        // 사용자 ID로 좋아요 목록 가져오기
        List<ToriBox> toriBoxList = toriBoxRepository.findByAid(aid);

        // 로그인한 사용자 정보 가져오기
        User loginUser = getLoginUser();

        // 좋아요한 게시글을 POSTDTO 리스트로 변환하여 반환
        return toriBoxList.stream()
                .map(toriBox -> convertToPostDTO(toriBox.getPost(), loginUser))
                .collect(Collectors.toList());
    }

    // 북마크 기능
    // 북마크 토글
    public boolean bookmarkPost(String email, Long postId) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Not Found user email :" + email));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Not Found post id :" + postId));

        // 사용자와 게시글로 북마크 찾기
        Optional<Bookmark> existingBookmark = bookmarkRepository.findByUserAndPost(user, post);

        // 이미 북마크가 있다면 삭제하고 false 반환
        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
            return false;
        } else {
            // 북마크가 없다면 새로 만들어서 저장하고 true 반환
            Bookmark bookmark = Bookmark.builder().post(post).user(user).build();
            bookmarkRepository.save(bookmark);
            return true;
        }
    }

    // 북마크 모아보기
    public List<PostDTO> getBookmarkedPosts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        List<Bookmark> bookmarks = bookmarkRepository.findByUser(user);
        // 북마크한 게시글을 PostDTO 리스트로 변환하여 반환
        return bookmarks.stream()
                .map(bookmark -> convertToPostDTO(bookmark.getPost(), user))
                .collect(Collectors.toList());
    }

    // Comment 기능
    // 댓글 목록 조회
    public PageResponseDTO<CommentDTO> getListOfComment(Long postId, PageRequestDTO pageRequestDTO) {
        // 페이징 객체 생성
        Pageable pageable = pageRequestDTO.getPageable("id");
        // 게시글 id와 페이징 객체로 댓글 목록 가져오기
        Page<Comment> result = commentRepository.listOfPost(postId, pageable);

        // 댓글을 CommentDTO 리스트로 변환
        List<CommentDTO> dtoList = result.getContent().stream()
                .map(comment -> {
                    User user = comment.getUser();
                    return CommentDTO.builder()
                            .id(comment.getId())
                            .content(comment.getContent())
                            .email(user.getEmail())
                            .nickName(user.getNickName())
                            .profileImage(user.getProfileImage())
                            .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                            .build();
                })
                .collect(Collectors.toList());

        return PageResponseDTO.<CommentDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .postLists(dtoList)
                .total((int) result.getTotalElements())
                .build();
    }

    // 댓글 등록
    public Long registerComment(CommentDTO commentDTO, Long postId) throws Exception {
        User user = userRepository.findByEmail(commentDTO.getEmail())
                .orElseThrow(() -> new Exception("Not Found auth email :" + commentDTO.getEmail()));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Not Found post id :" + postId));

        // CommentDTO를 Comment 엔티티로 매핑
        Comment comment = modelMapper.map(commentDTO, Comment.class);
        // 댓글에 게시글과 사용자 설정
        comment.setPost(post);
        comment.setUser(user);

        // 부모 댓글이 있다면 설정
        if (commentDTO.getParentId() != null) {
            Comment parent = commentRepository.findById(commentDTO.getParentId())
                    .orElseThrow(() -> new Exception("Not Found parent comment id :" + commentDTO.getParentId()));
            comment.setParent(parent);
        }

        return commentRepository.save(comment).getId();
    }

    // 특정 댓글 조회
    public CommentDTO readComment(Long id) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        User user = comment.getUser();

        // CommentDTO 생성하여 반환
        CommentDTO dto = CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .email(user.getEmail())
                .nickName(user.getNickName())
                .profileImage(user.getProfileImage())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .build();

        return dto;
    }

    // 댓글 삭제
    public void removeComment(Long id) {
        commentRepository.deleteById(id);
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
    public List<PostDTO> getPostsByEmail(String email) {
        // 사용자 이메일로 게시글 목록 가져오기
        List<Post> posts = postRepository.findByUser_Email(email);
        // 사용자 이메일로 사용자 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));
        // 게시글을 PostDTO 리스트로 변환하여 반환
        return posts.stream()
                .map(post -> convertToPostDTO(post, user))
                .collect(Collectors.toList());
    }

    // 내가 쓴 댓글 모아보기
    public List<CommentDTO> getCommentsByEmail(String email) {
        // 사용자 이메일로 사용자 찾기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // 사용자의 댓글 목록 가져오기
        List<Comment> comments = commentRepository.findByUser(user);
        // 댓글을 CommentDTO 리스트로 변환하여 반환
        return comments.stream()
                .map(comment -> {
                    CommentDTO dto = modelMapper.map(comment, CommentDTO.class);
                    dto.setEmail(user.getEmail());
                    dto.setNickName(user.getNickName());
                    dto.setProfileImage(user.getProfileImage());
                    dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 팔로잉한 사람 게시글 모아보기
    public List<PostDTO> getPostsByFollowing(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // 사용자의 팔로잉 목록 가져오기
        List<FollowDTO> followings = followService.getFollowings(user.getId(), Pageable.unpaged()).getContent();
        // 팔로잉한 사용자의 id 리스트 생성
        List<Long> followingIds = followings.stream()
                .map(FollowDTO::getUserId)
                .collect(Collectors.toList());
        // 팔로잉한 사용자의 게시글 목록 가져오기
        List<Post> posts = postRepository.findByUserIdIn(followingIds);
        return posts.stream()
                .map(post -> convertToPostDTO(post, user))
                .collect(Collectors.toList());
    }

    // 베스트 게시글
    public List<PostDTO> getTopPostsByToriBoxCount() {
        // 페이징 객체 생성 (첫 페이지, 사이즈 3)
        Pageable pageable = PageRequest.of(0, 3);
        // 좋아요 수가 많은 상위 게시글 가져오기
        Page<Post> topPosts = postRepository.findTopPostsByToriBoxCount(pageable);

        // 로그인한 사용자 정보 가져오기
        User loginUser = getLoginUser();

        return topPosts.getContent().stream()
                .map(post -> convertToPostDTO(post, loginUser))
                .collect(Collectors.toList());
    }

}