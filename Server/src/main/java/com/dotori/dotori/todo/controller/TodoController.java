package com.dotori.dotori.todo.controller;

import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/todo")
@RequiredArgsConstructor
@Log4j2
public class TodoController {

    private final TodoService todoService;


    @GetMapping
    public ResponseEntity<?> getAllTodos() {
        try {
            List<TodoDTO> todos = todoService.getAllTodo();

            // 카테고리별로 Todo 항목들을 그룹화
            Map<String, List<TodoDTO>> todoCategory = todos.stream()
                    .collect(Collectors.groupingBy(TodoDTO::getCategory));

            // 카테고리를 알파벳 순으로 정렬 (선택사항)
            Map<String, List<TodoDTO>> sortedTodoCategory = new TreeMap<>(todoCategory);

            return ResponseEntity.ok(sortedTodoCategory);
        } catch (Exception e) {
            log.error("Error while fetching todos", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping
    public ResponseEntity<TodoDTO> addTodo(@Valid @RequestBody TodoDTO todo) {
        try{
            return ResponseEntity.ok(todoService.addTodo(todo));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping()
    public ResponseEntity<TodoDTO> modifyTodo(@Valid @RequestBody TodoDTO todoDTO) {
        try{
            return ResponseEntity.ok(todoService.updateTodo(todoDTO));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteTodo(@Valid @RequestBody TodoDTO todoDTO) {
        try{
            TodoDTO deleteTodo = todoService.deleteTodo(todoDTO.getId());
            return ResponseEntity.ok(deleteTodo);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}