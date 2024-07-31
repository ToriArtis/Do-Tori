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
        modelMapper.createTypeMap(Todo.class, TodoDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getAuth().getEmail(), TodoDTO::setEmail); // Auth의 email을 TodoDTO의 email로 매핑
                    mapper.map(src -> src.getAuth().getNickName(), TodoDTO::setUserNickName); // Auth의 nickName을 TodoDTO의 userNickName으로 매핑
                });

        // Post 엔티티와 PostDTO 간의 매핑 설정
        modelMapper.createTypeMap(Post.class, PostDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getAuth().getNickName(), PostDTO::setNickName); // Auth의 nickName을 PostDTO의 nickName으로 매핑
                    mapper.map(src -> src.getAuth().getEmail(), PostDTO::setEmail); // Auth의 email을 PostDTO의 email로 매핑
                    mapper.map(src -> src.getAuth().getProfileImage(), PostDTO::setProfileImage); // Auth의 profileImage를 PostDTO의 profileImage로 매핑
                    mapper.map(src -> Optional.ofNullable(src.getTags())
                            .map(tags -> tags.stream().map(Tag::getName).collect(Collectors.toList())) // Tag의 name을 리스트로 수집
                            .orElse(Collections.emptyList()), PostDTO::setTags); // Tag 리스트를 PostDTO의 tags로 매핑, 없을 경우 빈 리스트로 설정
                    mapper.map(src -> Optional.ofNullable(src.getThumbnails())
                            .map(thumbnails -> thumbnails.stream().map(PostThumbnail::getThumbnail).collect(Collectors.toList())) // PostThumbnail의 thumbnail을 리스트로 수집
                            .orElse(Collections.emptyList()), PostDTO::setThumbnails); // PostThumbnail 리스트를 PostDTO의 thumbnails로 매핑, 없을 경우 빈 리스트로 설정
                });

        // Comment 엔티티와 CommentDTO 간의 매핑 설정
        modelMapper.createTypeMap(Comment.class, CommentDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getAuth().getEmail(), CommentDTO::setEmail); // Auth의 email을 CommentDTO의 email로 매핑
                    mapper.map(src -> src.getAuth().getNickName(), CommentDTO::setNickName); // Auth의 nickName을 CommentDTO의 nickName으로 매핑
                    mapper.map(src -> src.getAuth().getProfileImage(), CommentDTO::setProfileImage); // Auth의 profileImage를 CommentDTO의 profileImage로 매핑
                    mapper.map(src -> src.getParent() != null ? src.getParent().getId() : null, CommentDTO::setParentId); // 부모 댓글이 있을 경우 부모 댓글의 ID를 CommentDTO의 parentId로 매핑, 없을 경우 null로 설정
                });

        return modelMapper;
    }
}