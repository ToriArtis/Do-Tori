package com.dotori.dotori.todo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TodoDTO {

    private int id;
    private String email;  // aid를 email로 변경
    private String userNickName;

    @NotEmpty
    @Builder.Default
    private String category = "No category";

    @NotEmpty
    @NotNull
    private String content;

    private boolean done;

    @Builder.Default
    private LocalDate todoDate = LocalDate.now();
}
