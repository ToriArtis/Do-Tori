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

// TodoController.java
@RestController
@RequestMapping("/todo")
@RequiredArgsConstructor
@Log4j2
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAllTodos() {
        return ResponseEntity.ok(todoService.getAllTodo());
    }

    @PostMapping
    public ResponseEntity<TodoDTO> addTodo(@Valid @RequestBody TodoDTO todo) {

        return ResponseEntity.ok(todoService.addTodo(todo));
    }

    @PutMapping()
    public ResponseEntity<TodoDTO> modifyTodo(@Valid @RequestBody TodoDTO todoDTO) {
        return ResponseEntity.ok(todoService.updateTodo(todoDTO));
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteTodo(@Valid @RequestBody TodoDTO todoDTO) {
        TodoDTO deleteTodo = todoService.deleteTodo(todoDTO.getId());

        return ResponseEntity.ok(deleteTodo);
    }
}