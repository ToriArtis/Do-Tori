package com.dotori.dotori.post.entity;

import com.dotori.dotori.auth.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;

    private Long pid;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aid")
    private User user;

    @NotNull
    private String content;

    public void setPost(Long pid) {
        this.post = Post.builder().pid(pid).build();
    }

}