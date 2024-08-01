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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TodoDTO>> getAllTodos(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(todoService.getTodoByEmail(email));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TodoDTO> addTodo(@Valid @RequestBody TodoDTO todo, Principal principal) {
        String email = principal.getName();
        todo.setEmail(email);
        return ResponseEntity.ok(todoService.addTodo(todo));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TodoDTO> modifyTodo(@PathVariable int id, @Valid @RequestBody TodoDTO todoDTO, Principal principal) {
        String email = principal.getName();
        todoDTO.setId(id);
        todoDTO.setEmail(email);
        return ResponseEntity.ok(todoService.updateTodo(todoDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTodo(@PathVariable int id, Principal principal) {
        String email = principal.getName();
        todoService.deleteTodo(id, email);
        return ResponseEntity.ok().build();
    }
}