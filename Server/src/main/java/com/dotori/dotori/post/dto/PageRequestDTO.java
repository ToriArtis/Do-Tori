package com.dotori.dotori.post.dto;

import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    private int size = 10;

    private String type;
    private String keyword;

    public String[] getTypes() {
        if(type == null || type.isEmpty()) {
            return null;
        }
        return type.split(",");
    }

    public Pageable getPageable(String...props) {
        return PageRequest.of(0, this.size, Sort.by(props).descending());
    }

    private String link;

    public String getLink() {
        if(link == null) {
            StringBuilder builder = new StringBuilder();
            builder.append("&size=").append(this.size);
            if (type != null && !type.isEmpty()) {
                builder.append("&type=").append(type);
            }
            if (keyword != null && !keyword.isEmpty()) {
                try {
                    builder.append("&keyword=").append(URLEncoder.encode(keyword, "UTF-8"));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            link = builder.toString();
        }
        return link;
    }
}