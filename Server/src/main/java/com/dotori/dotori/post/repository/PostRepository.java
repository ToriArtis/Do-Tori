package com.dotori.dotori.post.repository;

import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.service.PostSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PostRepository extends JpaRepository<Post, Long>, PostSearch {

    Page<Post> findByContentContainingOrderByPidDesc(String keyword, Pageable pageable);

    @Query("select b FROM Post b where b.content like concat('%',:keyword,'%')")
    Page<Post> findKeyword(String keyword, Pageable pageable);

    @Query(value = "select now()", nativeQuery = true)
    String getTime();

    void deleteByUser_Id(Long aid);
}