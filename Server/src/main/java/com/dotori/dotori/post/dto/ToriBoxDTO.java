package com.dotori.dotori.post.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ToriBoxDTO {

    private Long id;

    @NotNull
    private Long aid;

    @NotNull
    private Long pid;
}