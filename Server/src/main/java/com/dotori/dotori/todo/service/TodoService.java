package com.dotori.dotori.todo.service;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.auth.repository.AuthRepository;
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
    private final AuthRepository authRepository;

    public TodoDTO addTodo(TodoDTO todoDTO) {
        Auth auth = authRepository.findByEmail(todoDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = modelMapper.map(todoDTO, Todo.class);
        todo.setAuth(auth);

        Todo savedTodo = todoRepository.save(todo);

        TodoDTO resultDTO = modelMapper.map(savedTodo, TodoDTO.class);
        resultDTO.setEmail(auth.getEmail());
        resultDTO.setUserNickName(auth.getNickName());

        return resultDTO;
    }

    public List<TodoDTO> getAllTodo() {
        return todoRepository.findAll().stream()
                .map(todo -> modelMapper.map(todo, TodoDTO.class))
                .collect(Collectors.toList());
    }

    public TodoDTO readOneTodo(int id) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        return modelMapper.map(todo, TodoDTO.class);
    }

    public TodoDTO updateTodo(TodoDTO todoDTO) {
        Todo todo = todoRepository.findById(todoDTO.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        Auth auth = authRepository.findByEmail(todoDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!todo.getAuth().getEmail().equals(auth.getEmail())) {
            throw new RuntimeException("You don't have permission to update this todo");
        }

        todo.setCategory(todoDTO.getCategory());
        todo.setContent(todoDTO.getContent());
        todo.setDone(todoDTO.isDone());
        todo.setTodoDate(todoDTO.getTodoDate());

        Todo updatedTodo = todoRepository.save(todo);

        TodoDTO resultDTO = modelMapper.map(updatedTodo, TodoDTO.class);
        resultDTO.setEmail(auth.getEmail());
        resultDTO.setUserNickName(auth.getNickName());

        return resultDTO;
    }

    public void deleteTodo(int id, String email) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        if (!todo.getAuth().getEmail().equals(email)) {
            throw new RuntimeException("You don't have permission to delete this todo");
        }
        todoRepository.delete(todo);
    }

    public List<TodoDTO> getTodoByEmail(String email) {
        Auth auth = authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Todo> todos = todoRepository.findByAuth(auth);
        return todos.stream()
                .map(todo -> TodoDTO.builder()
                        .id(todo.getId())
                        .email(todo.getAuth().getEmail())
                        .category(todo.getCategory())
                        .content(todo.getContent())
                        .done(todo.isDone())
                        .todoDate(todo.getTodoDate())
                        .userNickName(todo.getAuth().getNickName())
                        .build())
                .collect(Collectors.toList());
    }
}
