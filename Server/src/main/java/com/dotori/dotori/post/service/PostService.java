package com.dotori.dotori.post.service;

import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
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

    public PageResponseDTO<PostDTO> list(PageRequestDTO pageRequestDTO) {
        String[] types = pageRequestDTO.getTypes();
        String keyword = pageRequestDTO.getKeyword();
        Pageable pageable = pageRequestDTO.getPageable("pid");

        Page<Post> result = postRepository.searchAll(types, keyword, pageable);

        // 현재 로그인한 사용자의 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User loginUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        List<PostDTO> postDTOS = result.stream()
                .map(posts -> {
                    PostDTO postDTO = modelMapper.map(posts, PostDTO.class);
                    List<String> thumbnails = posts.getThumbnails().stream()
                            .map(PostThumbnail::getThumbnail)
                            .collect(Collectors.toList());
                    List<String> tagNames = posts.getTags().stream()
                            .map(Tag::getName)
                            .collect(Collectors.toList());
                    postDTO.setTags(tagNames);
                    postDTO.setThumbnails(thumbnails);
                    postDTO.setToriBoxCount(countLikes(postDTO.getPid()));
                    postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(posts));
                    postDTO.setProfileImage(posts.getUser().getProfileImage());
                    postDTO.setEmail(posts.getUser().getEmail()); // email 값 설정
                    postDTO.setCommentCount(commentRepository.countByPost(posts));
                    postDTO.setLiked(isLikedByUser(posts.getPid(), loginUser.getId())); // 좋아요 여부 설정
                    postDTO.setBookmarked(isBookmarkedByUser(loginUser.getEmail(), posts.getPid()));
                    return postDTO;
                })
                .collect(Collectors.toList());

        // 전체 댓글 수 계산
        int totalCommentCount = postDTOS.stream()
                .mapToInt(postDTO -> postDTO.getCommentCount().intValue())
                .sum();

        PageResponseDTO<PostDTO> pageResponseDTO = PageResponseDTO.<PostDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .postLists(postDTOS)
                .total((int) result.getTotalElements())
                .build();

        pageResponseDTO.setCommentCount(totalCommentCount); // 전체 댓글 수 설정

        return pageResponseDTO;
    }

    public Long addPost(PostDTO postDTO, List<MultipartFile> files) throws Exception {
        User user = userRepository.findByEmail(postDTO.getEmail())
                .orElseThrow(() -> new Exception("Not Found user email: " + postDTO.getEmail()));

        Post post = modelMapper.map(postDTO, Post.class);
        post.setUser(user);
        post.setNickName(user.getNickName());

        List<Tag> tags = new ArrayList<>();
        for (String tagName : postDTO.getTags()) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(new Tag(null, tagName, new ArrayList<>())));
            tags.add(tag);
        }
        post.setTags(tags);

        if (files != null && !files.isEmpty()) {
            if (files.size() > postDTO.getThumbnailLimit()) {
                throw new Exception("Number of thumbnails exceeds the limit of " + postDTO.getThumbnailLimit());
            }

            List<PostThumbnail> thumbnails = uploadImages(files, post);
            post.getThumbnails().addAll(thumbnails);
        }

        return postRepository.save(post).getPid();
    }

    public PostDTO getPost(Long id) {
        Post result = postRepository.findById(id).orElseThrow();
        PostDTO postDTO = modelMapper.map(result, PostDTO.class);

        // 현재 로그인한 사용자의 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User loginUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        postDTO.setNickName(result.getUser().getNickName());
        postDTO.setProfileImage(result.getUser().getProfileImage());
        postDTO.setEmail(result.getUser().getEmail()); // email 값 설정
        postDTO.setToriBoxCount(countLikes(postDTO.getPid()));
        postDTO.setBookmarked(isBookmarkedByUser(postDTO.getEmail(), id));
        postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(result));
        postDTO.setCommentCount(commentRepository.countByPost(result));
        postDTO.setLiked(isLikedByUser(result.getPid(), loginUser.getId())); // 좋아요 여부 설정
        postDTO.setBookmarked(isBookmarkedByUser(loginUser.getEmail(), result.getPid()));


        List<String> tagNames = result.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        postDTO.setTags(tagNames);

        List<String> thumbnails = result.getThumbnails().stream()
                .map(PostThumbnail::getThumbnail)
                .collect(Collectors.toList());
        postDTO.setThumbnails(thumbnails);
        return postDTO;
    }

    public void modifyPost(PostDTO postDTO, List<MultipartFile> files, List<String> deletedThumbnails) throws Exception {
        Post post = postRepository.findById(postDTO.getPid()).orElseThrow();
        User user = userRepository.findByEmail(postDTO.getEmail())
                .orElseThrow(() -> new Exception("Not Found user email: " + postDTO.getEmail()));

        if (post.getNickName() == null || !post.getNickName().equals(user.getNickName())) {
            post.setNickName(user.getNickName());
        }

        if (deletedThumbnails != null && !deletedThumbnails.isEmpty()) {
            post.getThumbnails().removeIf(thumbnail -> deletedThumbnails.contains(thumbnail.getThumbnail()));
        }

        if (files != null && !files.isEmpty()) {
            List<PostThumbnail> thumbnails = uploadImages(files, post);
            post.getThumbnails().addAll(thumbnails);
        }

        if (postDTO.getTags() != null && !postDTO.getTags().isEmpty()) {
            List<String> tagNames = post.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toList());
            postDTO.setTags(tagNames);
        }

        post.changePost(postDTO.getContent(), LocalDateTime.now(), post.getThumbnails());
        postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Long toriBoxPost(ToriBoxDTO toriBoxDTO) throws Exception {
        User user = userRepository.findById(toriBoxDTO.getAid())
                .orElseThrow(() -> new Exception("Not Found auth id :" + toriBoxDTO.getAid()));

        Post post = postRepository.findById(toriBoxDTO.getPid())
                .orElseThrow(() -> new Exception("Not Found post id :" + toriBoxDTO.getPid()));

        Optional<ToriBox> existingLike = toriBoxRepository.findByAidAndPost(user.getId(), post);

        if (existingLike.isPresent()) {
            toriBoxRepository.delete(existingLike.get());
            return -1L; // Long 타입으로 반환
        } else {
            ToriBox toriBox = ToriBox.builder().post(post).pid(post.getPid()).aid(user.getId()).build();
            return toriBoxRepository.save(toriBox).getId(); // 그대로 Long 반환
        }
    }

    public Long countLikes(Long pid) {
        Post post = postRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Not Found post id :" + pid));
        return (long) toriBoxRepository.countByPost(post);
    }

    public boolean isLikedByUser(Long pid, Long aid) {
        Post post = postRepository.findById(pid)
                .orElseThrow(() -> new RuntimeException("Not Found post id :" + pid));
        Optional<ToriBox> existingLike = toriBoxRepository.findByAidAndPost(aid, post);
        return existingLike.isPresent();
    }

    public List<PostDTO> toriBoxSelectAll(Long aid) {
        List<ToriBox> toriBoxList = toriBoxRepository.findByAid(aid);

        // 현재 로그인한 사용자의 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User loginUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        return toriBoxList.stream()
                .map(toriBox -> {
                    Post post = toriBox.getPost();
                    PostDTO postDTO = modelMapper.map(post, PostDTO.class);
                    List<String> thumbnails = post.getThumbnails().stream()
                            .map(PostThumbnail::getThumbnail)
                            .collect(Collectors.toList());
                    postDTO.setThumbnails(thumbnails);
                    List<String> tagNames = post.getTags().stream()
                            .map(Tag::getName)
                            .collect(Collectors.toList());
                    postDTO.setTags(tagNames);
                    postDTO.setToriBoxCount(countLikes(post.getPid()));
                    postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(post));
                    postDTO.setCommentCount(commentRepository.countByPost(post));
                    postDTO.setLiked(isLikedByUser(post.getPid(), loginUser.getId())); // 좋아요 여부 설정
                    postDTO.setBookmarked(isBookmarkedByUser(loginUser.getEmail(), post.getPid()));

                    return postDTO;
                })
                .collect(Collectors.toList());
    }

    public Long bookmarkPost(String email, Long postId) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Not Found user email :" + email));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Not Found post id :" + postId));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByUserAndPost(user, post);

        if (existingBookmark.isPresent()) {
            bookmarkRepository.delete(existingBookmark.get());
            return -1L;
        } else {
            Bookmark bookmark = Bookmark.builder().post(post).user(user).build();
            return bookmarkRepository.save(bookmark).getId();
        }
    }

    public boolean isBookmarkedByUser(String email, Long postId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Not Found post id :" + postId));

        Optional<Bookmark> existingBookmark = bookmarkRepository.findByUserAndPost(user, post);
        return existingBookmark.isPresent();
    }

    public List<PostDTO> getBookmarkedPosts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        // 현재 로그인한 사용자의 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User loginUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        List<Bookmark> bookmarks = bookmarkRepository.findByUser(user);
        return bookmarks.stream()
                .map(bookmark -> {
                    Post post = bookmark.getPost();
                    PostDTO postDTO = modelMapper.map(post, PostDTO.class);
                    List<String> thumbnails = post.getThumbnails().stream()
                            .map(PostThumbnail::getThumbnail)
                            .collect(Collectors.toList());
                    postDTO.setThumbnails(thumbnails);
                    List<String> tagNames = post.getTags().stream()
                            .map(Tag::getName)
                            .collect(Collectors.toList());
                    postDTO.setTags(tagNames);
                    postDTO.setEmail(post.getUser().getEmail()); // email 값 설정
                    postDTO.setToriBoxCount(countLikes(postDTO.getPid()));
                    postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(post));
                    postDTO.setCommentCount(commentRepository.countByPost(post));
                    postDTO.setLiked(isLikedByUser(post.getPid(), loginUser.getId())); // 좋아요 여부 설정
                    postDTO.setBookmarked(isBookmarkedByUser(loginUser.getEmail(), post.getPid()));
                    return postDTO;
                })
                .collect(Collectors.toList());
    }

    public List<PostDTO> getTopPostsByToriBoxCount() {
        Pageable pageable = PageRequest.of(0, 3);
        Page<Post> topPosts = postRepository.findTopPostsByToriBoxCount(pageable);

        // 현재 로그인한 사용자의 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User loginUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Not Found user email :" + email));

        return topPosts.getContent().stream()
                .map(post -> {
                    PostDTO postDTO = modelMapper.map(post, PostDTO.class);
                    List<String> thumbnails = post.getThumbnails().stream()
                            .map(PostThumbnail::getThumbnail)
                            .collect(Collectors.toList());
                    List<String> tagNames = post.getTags().stream()
                            .map(Tag::getName)
                            .collect(Collectors.toList());
                    postDTO.setTags(tagNames);
                    postDTO.setThumbnails(thumbnails);
                    postDTO.setBookmarkCount((long) bookmarkRepository.countByPost(post));
                    postDTO.setProfileImage(post.getUser().getProfileImage());
                    postDTO.setEmail(post.getUser().getEmail()); // email 값 설정
                    postDTO.setToriBoxCount(countLikes(post.getPid()));
                    postDTO.setCommentCount(commentRepository.countByPost(post));
                    postDTO.setLiked(isLikedByUser(post.getPid(), loginUser.getId())); // 좋아요 여부 설정
                    postDTO.setBookmarked(isBookmarkedByUser(loginUser.getEmail(), post.getPid()));
                    return postDTO;
                })
                .collect(Collectors.toList());

    }

    public Long registerComment(CommentDTO commentDTO, Long postId) throws Exception {
        User user = userRepository.findById(commentDTO.getAid())
                .orElseThrow(() -> new Exception("Not Found auth id :" + commentDTO.getAid()));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new Exception("Not Found post id :" + postId));

        Comment comment = modelMapper.map(commentDTO, Comment.class);
        comment.setPost(post);
        comment.setUser(user);

        if (commentDTO.getParentId() != null) {
            Comment parent = commentRepository.findById(commentDTO.getParentId())
                    .orElseThrow(() -> new Exception("Not Found parent comment id :" + commentDTO.getParentId()));
            comment.setParent(parent);
        }

        return commentRepository.save(comment).getId();
    }

    public CommentDTO readComment(Long id) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        User user = comment.getUser();

        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .aid(user.getId())
                .nickName(user.getNickName())
                .profileImage(user.getProfileImage())
                .build();
    }

    public void removeComment(Long id) {
        commentRepository.deleteById(id);
    }

    public PageResponseDTO<CommentDTO> getListOfComment(Long postId, PageRequestDTO pageRequestDTO) {
        Pageable pageable = pageRequestDTO.getPageable("id");
        Page<Comment> result = commentRepository.listOfPost(postId, pageable);

        List<CommentDTO> dtoList = result.getContent().stream()
                .map(comment -> {
                    User user = comment.getUser();
                    return CommentDTO.builder()
                            .id(comment.getId())
                            .content(comment.getContent())
                            .aid(user.getId())
                            .nickName(user.getNickName())
                            .profileImage(user.getProfileImage())
                            .build();
                })
                .collect(Collectors.toList());

        return PageResponseDTO.<CommentDTO>withAll()
                .pageRequestDTO(pageRequestDTO)
                .postLists(dtoList)
                .total((int) result.getTotalElements())
                .build();
    }

    public Page<Post> searchAll(String[] types, String keyword, Pageable pageable) {
        return postSearchImpl.searchAll(types, keyword, pageable);
    }

    public Page<PostListCommentCountDTO> searchWithCommentCount(String[] types, String keyword, Pageable pageable) {
        return postSearchImpl.searchWithCommentCount(types, keyword, pageable);
    }

    private List<PostThumbnail> uploadImages(List<MultipartFile> files, Post post) throws Exception {
        List<PostThumbnail> thumbnails = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                String originalName = file.getOriginalFilename();
                if (originalName != null && !originalName.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + originalName;
                    String savePath = System.getProperty("user.dir") + "/Server/src/main/resources/static/images/";
                    if (!new File(savePath).exists()) {
                        new File(savePath).mkdir();
                    }
                    String filePath = savePath + fileName;
                    file.transferTo(new File(filePath));
                    PostThumbnail postThumbnail = new PostThumbnail(fileName);
                    postThumbnail.setPost(post);
                    thumbnails.add(postThumbnail);
                }
            }
        }

        return thumbnails;
    }
}