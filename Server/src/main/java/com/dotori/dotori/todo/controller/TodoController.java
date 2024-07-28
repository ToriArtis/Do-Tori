package com.dotori.dotori.todo.controller;

import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.service.TodoService;
import com.dotori.dotori.auth.dto.AuthSecurityDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@Log4j2
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAllTodos(@AuthenticationPrincipal AuthSecurityDTO authSecurityDTO) {
        return ResponseEntity.ok(todoService.getTodoByEmail(authSecurityDTO.getEmail()));
    }

    @PostMapping
    public ResponseEntity<TodoDTO> addTodo(@RequestBody @Valid TodoDTO todoDTO) {
        log.info("Add todo: {}", todoDTO);
        return ResponseEntity.ok(todoService.addTodo(todoDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDTO> updateTodo(@PathVariable int id, @RequestBody @Valid TodoDTO todoDTO) {
        todoDTO.setId(id);
        todoService.updateTodo(todoDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable int id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok().build();
    }
}