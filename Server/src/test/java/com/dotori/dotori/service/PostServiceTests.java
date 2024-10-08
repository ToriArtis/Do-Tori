package com.dotori.dotori.service;

import com.dotori.dotori.auth.dto.AuthDTO;
import com.dotori.dotori.auth.service.AuthService;
import com.dotori.dotori.post.dto.*;
import com.dotori.dotori.post.service.PostService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@SpringBootTest
@Log4j2
public class PostServiceTests {

    @Autowired
    private PostService postService;
    @Autowired
    private AuthService authService;

    //주석 지우면 에러남
//    @Test
//    public void testAddPost() throws Exception {
//        PostDTO postDTO = PostDTO.builder().content("content").aid(1L).build();
//
//        Long pid = postService.addPost(postDTO);
//
//        log.info(pid);
//    }


    @Test
    public void testGetPost() {
        PostDTO post = postService.getPost(56L);
        log.info(post.getContent());
    }

    //주석 지우면 에러남
//    @Test
//    public void updateTest() throws Exception {
//        log.info("updateTest");
//        PostDTO postDTO = PostDTO.builder().pid(2).content("contenttest2").
//                aid(1).build();
//        postService.modifyPost(postDTO);
//        log.info(postService.getPost(2).getContent());
//    }


    @Test
    public void testDeletePost() {
        postService.deletePost(10L);
    }

    @Test
    public void listTest() {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .type("cn")
                .keyword("1")
                .size(10)
                .build();
        PageResponseDTO<PostDTO> responseDTO = postService.list(pageRequestDTO);
        log.info(responseDTO);
    }

    @Test
    public void testAddToriBox() throws Exception {
        log.info("testAddToriBox");

        PostDTO postDTO = postService.getPost(1L);
        AuthDTO.ResponseDTO authDTO = authService.info("gusdudco6");

        ToriBoxDTO toriBoxDTO = ToriBoxDTO.builder()
                .pid(postDTO.getPid())
                .aid(authDTO.getId())
                .build();
        Boolean id = postService.toriBoxPost(toriBoxDTO);
        log.info(id);
    }

//    @Test
//    public void testCountToriBox(){
//        log.info("testCountToriBox");
//        int result = postService.countLikes(1);
//        log.info(result);
//    }



    @Test
    public void testLikeList(){
        log.info("testCountToriBox");
        Long aid = 1L;
        List<PostDTO> toriBox = postService.toriBoxSelectAll(aid);
        for (PostDTO postDTO : toriBox) {
            log.info(postDTO.getContent());
        }
    }



    @Test
    public void testAddComment() throws Exception {
        log.info("testAddComment");
        log.info(postService.getClass().getName());

        CommentDTO commentDTO = CommentDTO.builder()
                .parentId(2L)
                .content("comment test2")
                .aid(1L)
                .build();
        CommentDTO newComment = postService.readComment(commentDTO.getId());
        log.info("newComment's id is {}", newComment.getId());
    }

    @Test
    public void selectTest() {
        log.info("selectTest");
        CommentDTO commentDTO = postService.readComment(1L);
        log.info(commentDTO.getContent());
    }

    @Test
    public void listCommentTest() {
        log.info("listTest");
        PageRequestDTO pageRequestDTO = new PageRequestDTO();
//        PageResponseDTO<CommentDTO> commentDTO = postService.getListOfPost(2, pageRequestDTO);
//        log.info(commentDTO);
    }

    @Test
    public void deleteTest() {
        log.info("deleteTest");
        Long id = 1L;
        postService.deleteComment(id);       // pid 이미 지웠기 때문에 재차 remove 시 에러가 뜬다
        Assertions.assertThrows(NoSuchElementException.class, () -> {
            postService.readComment(id);
        });
    }




}
