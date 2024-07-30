package com.dotori.dotori.todo.controller;

import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
@Log4j2
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoDTO>> getAllTodos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(todoService.getTodoByEmail(email));
    }

    @PostMapping
    public ResponseEntity<TodoDTO> addTodo(@Valid @RequestBody TodoDTO todo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            todo.setEmail(email);
            log.info("Setting email: " + email);
        } else {
            log.warn("No authenticated user found");
        }
        return ResponseEntity.ok(todoService.addTodo(todo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDTO> modifyTodo(@PathVariable int id, @Valid @RequestBody TodoDTO todoDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            todoDTO.setId(id);
            todoDTO.setEmail(email);
            log.info("Updating todo. ID: " + id + ", Email: " + email);
        } else {
            log.warn("No authenticated user found for todo update");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(todoService.updateTodo(todoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        todoService.deleteTodo(id, email);
        return ResponseEntity.ok().build();
    }
}