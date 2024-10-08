package com.dotori.dotori.post.entity;

import com.dotori.dotori.auth.entity.Auth;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Builder
@Setter
@ToString(exclude = "tags")
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(value = {AuditingEntityListener.class})
public class Post{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pid")
    private Long pid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_id")
    private Auth auth;

    @Column(name = "nickName")
    private String nickName;

    @Column(nullable = false,length = 500)
    private String content;

    @CreatedDate
    @Builder.Default
    @Column(name = "regDate", updatable = false)
    private LocalDateTime regDate = LocalDateTime.now();

    @LastModifiedDate
    @Column(name = "modDate")
    private LocalDateTime modDate;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PostThumbnail> thumbnails = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "post_tag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private List<Tag> tags = new ArrayList<>();

    // cascade 추가하여 연관된 엔티티 먼저 삭제
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @Builder.Default
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "post_mentions",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "auth_id")
    )
    private Set<Auth> mentionedUsers = new HashSet<>();

    public void changePost(String content, LocalDateTime modDate, List<PostThumbnail> thumbnails) {
        this.content = content;
        this.modDate = modDate;
        this.thumbnails = thumbnails;
    }

    public void changePost(String content) {
        this.content = content;
    }

    public void addThumbnail(PostThumbnail postThumbnail) {
        this.thumbnails.add(postThumbnail);
        postThumbnail.setPost(this);
    }

    public void addMention(Auth user) {
        this.mentionedUsers.add(user);
    }

    public void removeMention(Auth user) {
        this.mentionedUsers.remove(user);
    }

    public Set<Auth> getMentionedUsers() {
        return this.mentionedUsers;
    }


}
