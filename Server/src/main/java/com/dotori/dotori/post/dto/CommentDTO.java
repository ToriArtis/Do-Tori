package com.dotori.dotori.post.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

    private Long id;

    @NotEmpty
    private String content;
    private Long parentId;
    private String email;
    private String nickName;
    private String profileImage;
    private LocalDateTime regDate;
}