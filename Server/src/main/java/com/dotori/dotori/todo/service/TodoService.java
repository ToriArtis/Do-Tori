package com.dotori.dotori.todo.service;

import com.dotori.dotori.auth.entity.User;
import com.dotori.dotori.auth.repository.UserRepository;
import com.dotori.dotori.todo.dto.TodoDTO;
import com.dotori.dotori.todo.entity.Todo;
import com.dotori.dotori.todo.repository.TodoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public TodoDTO addTodo(TodoDTO todoDTO) {
        Todo todo = modelMapper.map(todoDTO, Todo.class);
        log.info("Add todo: " + todo);
        Todo savedTodo = todoRepository.save(todo);
        return modelMapper.map(savedTodo, TodoDTO.class);
    }

    public List<TodoDTO> getAllTodo() {
        List<TodoDTO> dtoList = todoRepository.findAll().stream()
                .map(todo -> modelMapper.map(todo, TodoDTO.class))
                .collect(Collectors.toList());
        return dtoList;
    }

    public TodoDTO readOneTodo(int id) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        TodoDTO todoDTO = modelMapper.map(todo, TodoDTO.class);
        return todoDTO;
    }

    public TodoDTO updateTodo(TodoDTO todoDTO) {
        Todo todo = todoRepository.findById(todoDTO.getId()).orElseThrow();
        todo.changeTodo(todoDTO.getCategory(), todoDTO.getContent(), todoDTO.isDone(), todoDTO.getTodoDate());
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Todo Service : Todo updated " + todo + " TodoDTO : " + todoDTO);
        return modelMapper.map(updatedTodo, TodoDTO.class);
    }

    public void deleteTodo(int id) {
        todoRepository.deleteById(id);
    }

    public List<TodoDTO> getTodoByAid(int aid) {
        List<Todo> todos = todoRepository.findByAid(aid);
        return todos.stream()
                .map(todo -> modelMapper.map(todo, TodoDTO.class))
                .collect(Collectors.toList());
    }

    public List<TodoDTO> getTodoByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getTodoByAid(user.getId().intValue());
    }
}