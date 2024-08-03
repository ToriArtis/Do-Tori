package com.dotori.dotori.post.repository;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.post.entity.Bookmark;
import com.dotori.dotori.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByAuthAndPost(Auth auth, Post post);
    List<Bookmark> findByAuth(Auth auth);
    int countByPost(Post post);
    void deleteByPost(Post post);
    Optional<Object> findByAuthEmailAndPost(String email, Post post);
}

