package com.dotori.dotori.post.dto;

import lombok.Data;

import java.time.LocalDateTime;
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
    private Long toriBoxCount;
    private Long commentCount;
    private String thumbnail;

    public PostListCommentCountDTO(Long pid, String email, String content, String nickName, String profileImage, LocalDateTime regDate, LocalDateTime modDate, String thumbnail, Long commentCount) {
        this.pid = pid;
        this.email = email;
        this.content = content;
        this.profileImage = profileImage;
        this.nickName = nickName;
        this.regDate = regDate;
        this.modDate = modDate;
        this.thumbnail = thumbnail;
        this.commentCount = commentCount;
    }

    public PostListCommentCountDTO() {
    }
}