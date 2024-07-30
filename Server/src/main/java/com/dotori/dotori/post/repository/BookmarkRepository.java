package com.dotori.dotori.post.repository;

import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.post.entity.Bookmark;
import com.dotori.dotori.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByUserAndPost(User user, Post post);
    List<Bookmark> findByUser(User user);
    int countByPost(Post post);

}

