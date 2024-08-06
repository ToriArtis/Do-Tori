package com.dotori.dotori.post.repository;

import com.dotori.dotori.post.entity.Comment;
import com.dotori.dotori.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select c from Comment c where c.post.pid = :pid")
    Page<Comment> listOfPost(Long pid, Pageable pageable);

    long countByPost(Post post);

    List<Comment> findByAuth_Id(Long authId);

    void deleteByAuth_Id(Long aid);
}