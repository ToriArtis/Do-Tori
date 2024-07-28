package com.dotori.dotori.post.repository;

import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.entity.ToriBox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToriBoxRepository extends JpaRepository<ToriBox, Long> {

    Optional<ToriBox> findByAidAndPost(Long aid, Post post);
    int countByPost(Post post);
    List<ToriBox> findByAid(Long aid);
    void deleteByAid(Long aid);
}