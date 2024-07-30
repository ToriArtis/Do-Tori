package com.dotori.dotori.post.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
public class PostListCommentCountDTO {
    private Long pid;
    private String email;
    private String content;
    private String nickName;
    private String profileImage;
    private LocalDateTime regDate;
    private LocalDateTime modDate;
    private String thumbnail;
    private Long commentCount;
    private Long toriBoxCount;
    private Long bookmarkCount;
    private boolean liked;
    private boolean bookmarked;
    private List<String> tags;

    public PostListCommentCountDTO(Long pid, String email, String content, String nickName, String profileImage,
                                   LocalDateTime regDate, LocalDateTime modDate, String thumbnail,
                                   Long commentCount, Long toriBoxCount, Long bookmarkCount, String tags) {
        this.pid = pid;
        this.email = email;
        this.content = content;
        this.nickName = nickName;
        this.profileImage = profileImage;
        this.regDate = regDate;
        this.modDate = modDate;
        this.thumbnail = thumbnail;
        this.commentCount = commentCount;
        this.toriBoxCount = toriBoxCount;
        this.bookmarkCount = bookmarkCount;
        this.tags = tags != null ? Arrays.asList(tags.split(",")) : new ArrayList<>();
    }

    public PostListCommentCountDTO() {
    }
}