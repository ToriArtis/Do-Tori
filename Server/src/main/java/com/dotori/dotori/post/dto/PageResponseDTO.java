package com.dotori.dotori.post.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class PageResponseDTO<E> {

    private int size;
    private int total;
    private int commentCount;
    private boolean realEnd;
    private long currentTime;
    private List<E> postLists;

    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(PageRequestDTO pageRequestDTO, List<E> postLists, int total, boolean realEnd) {
        if(total <= 0) {
            return;
        }
        this.size = pageRequestDTO.getSize();
        this.total = total;
        this.realEnd = realEnd;
        this.postLists = postLists;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public void setCurrentTime(long currentTime) {
        this.currentTime = currentTime;
    }
}