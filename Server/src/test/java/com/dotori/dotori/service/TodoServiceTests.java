package com.dotori.dotori.service;

import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.service.TodoService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@Log4j2
@SpringBootTest
public class TodoServiceTests {
    // getLoginUser()로 로그인 유저 받아와서 테스트 패쓰~

    @Autowired
    private TodoService todoService;

    @Test
    public void testAddTodo() {
        TodoDTO todo = TodoDTO.builder()
                .content("testTodo")
                .id(1)
                .build();

        TodoDTO result = todoService.addTodo(todo);
        log.info(todo.toString());
    }

    @Test
    public void testGetAllTodo(){
        List<TodoDTO> todos = todoService.getAllTodo();
        todos.forEach(
                todo -> log.info(todo.toString())
        );
    }

    @Test
    public void testUpdateTodo(){
        TodoDTO todoDTO = TodoDTO.builder()
                .id(100)
                .category("공부")
                .content("Service test")
                .done(true).build();
        todoService.updateTodo(todoDTO);
    }

    @Test
    public void testDeleteTodo(){
        todoService.deleteTodo(101);
    }

}