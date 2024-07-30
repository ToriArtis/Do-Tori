package com.dotori.dotori.config;

import com.dotori.dotori.post.dto.CommentDTO;
import com.dotori.dotori.post.dto.PostDTO;
import com.dotori.dotori.post.entity.Comment;
import com.dotori.dotori.post.entity.Post;
import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.entity.Todo;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RootConfig{
    @Bean
    public ModelMapper getMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE)
                .setMatchingStrategy(MatchingStrategies.LOOSE);

        modelMapper.createTypeMap(Todo.class, TodoDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getUser().getEmail(), TodoDTO::setEmail);
                    mapper.map(src -> src.getUser().getNickName(), TodoDTO::setUserNickName);
                });

        modelMapper.createTypeMap(Post.class, PostDTO.class)
                .addMappings(mapper -> mapper.map(src -> src.getUser().getNickName(), PostDTO::setNickName));

        return modelMapper;
    }
}
