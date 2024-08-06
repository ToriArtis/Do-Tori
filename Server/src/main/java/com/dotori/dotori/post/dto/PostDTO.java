package com.dotori.dotori.post.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {

    private Long pid;

    private Long commentCount;

    private Long toriBoxCount;
    private boolean liked;

    private Long bookmarkCount;
    private boolean bookmarked;

    @NotEmpty
    @Size(min = 1, max = 500)
    private String content;

    private Long aid;  // email 대신 aid(Auth ID)를 사용
    private String nickName;
    private String profileImage;

    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now();
    private LocalDateTime modDate;

    @Builder.Default
    private List<String> thumbnails = new ArrayList<>();

    @Builder.Default
    private int thumbnailLimit = 4;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private Set<Long> mentionedUserIds = new HashSet<>();

    public void setToriBoxCount(Long toriBoxCount) {
        this.toriBoxCount = toriBoxCount;
    }

}