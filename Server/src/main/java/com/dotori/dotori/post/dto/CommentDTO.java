package com.dotori.dotori.post.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

    private Long id;

    @NotNull
    private Long pid;

    @NotEmpty
    private String content;

    private Long aid;
    private String nickName;
    private String profileImage;
}