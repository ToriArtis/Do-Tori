package com.dotori.dotori.config;

import com.dotori.dotori.post.dto.CommentDTO;
import com.dotori.dotori.post.dto.PostDTO;
import com.dotori.dotori.post.entity.Comment;
import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.post.entity.PostThumbnail;
import com.dotori.dotori.post.entity.Tag;
import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.entity.Todo;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@Configuration
public class RootConfig {
    @Bean
    public ModelMapper getMapper() {
        ModelMapper modelMapper = new ModelMapper();
        // ModelMapper 설정
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true) // 필드 매칭 활성화
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE) // 필드 접근 레벨을 PRIVATE로 설정
                .setMatchingStrategy(MatchingStrategies.STRICT); // 매칭 전략을 STRICT로 설정

        // Todo 엔티티와 TodoDTO 간의 매핑 설정
        modelMapper.createTypeMap(Todo.class, TodoDTO.class);

        // Post 엔티티와 PostDTO 간의 매핑 설정
        modelMapper.createTypeMap(Post.class, PostDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getAuth().getNickName(), PostDTO::setNickName);
                    mapper.map(src -> src.getAuth().getId(), PostDTO::setAid); // email 대신 id(aid)를 매핑
                    mapper.map(src -> src.getAuth().getProfileImage(), PostDTO::setProfileImage);
                    mapper.map(src -> Optional.ofNullable(src.getTags())
                            .map(tags -> tags.stream().map(Tag::getName).collect(Collectors.toList()))
                            .orElse(Collections.emptyList()), PostDTO::setTags);
                    mapper.map(src -> Optional.ofNullable(src.getThumbnails())
                            .map(thumbnails -> thumbnails.stream().map(PostThumbnail::getThumbnail).collect(Collectors.toList()))
                            .orElse(Collections.emptyList()), PostDTO::setThumbnails);
                });

        // Comment 엔티티와 CommentDTO 간의 매핑 설정
        modelMapper.createTypeMap(Comment.class, CommentDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getAuth().getId(), CommentDTO::setAid); // email 대신 id(aid)를 매핑
                    mapper.map(src -> src.getAuth().getNickName(), CommentDTO::setNickName);
                    mapper.map(src -> src.getAuth().getProfileImage(), CommentDTO::setProfileImage);
                    mapper.map(src -> src.getParent() != null ? src.getParent().getId() : null, CommentDTO::setParentId);
                });

        return modelMapper;
    }
}