package com.dotori.dotori.post.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {

    private Long pid;
    private Long commentCount;
    private Long toriBoxCount;

    private String email;
    private String nickName;
    private String profileImage;

    @NotEmpty
    @Size(min = 1, max = 500)
    private String content;

    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now();
    private LocalDateTime modDate;

    @Builder.Default
    private List<String> thumbnails = new ArrayList<>();

    private boolean liked;

    public void setToriBoxCount(Long toriBoxCount) {
        this.toriBoxCount = toriBoxCount;
    }

}