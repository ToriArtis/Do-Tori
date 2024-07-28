package com.dotori.dotori.post.service;


import com.dotori.dotori.post.dto.PostListCommentCountDTO;
import com.dotori.dotori.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostSearch {

    Page<Post> searchAll(String[] types, String keyword, Pageable pageable);
    Page<PostListCommentCountDTO> searchWithCommentCount(String[] types, String keyword, Pageable pageable);
}