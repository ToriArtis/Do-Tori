package com.dotori.dotori.config;

import com.dotori.dotori.post.dto.PostDTO;
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

        // PostDTO의 nickName 필드와 Post 엔티티의 auth.nickName 매핑
        modelMapper.createTypeMap(Post.class, PostDTO.class)
                .addMappings(mapper -> mapper.map(src -> src.getUser().getNickName(), PostDTO::setNickName));

        // TodoDTO와 Todo 엔티티 간의 필드 매핑
        modelMapper.createTypeMap(TodoDTO.class, Todo.class)
                .addMappings(mapper -> {
                    mapper.map(TodoDTO::getAid, Todo::setAid);
                    mapper.map(TodoDTO::getCategory, Todo::setCategory);
                    mapper.map(TodoDTO::getContent, Todo::setContent);
                    mapper.map(TodoDTO::isDone, Todo::setDone);
                    mapper.map(TodoDTO::getTodoDate, Todo::setTodoDate);
                });

        return modelMapper;
    }
}
