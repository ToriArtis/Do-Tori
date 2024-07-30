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
        User user = userRepository.findByEmail(todoDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Todo todo = modelMapper.map(todoDTO, Todo.class);
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);

        TodoDTO resultDTO = modelMapper.map(savedTodo, TodoDTO.class);
        resultDTO.setEmail(user.getEmail());
        resultDTO.setUserNickName(user.getNickName());

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

        User user = userRepository.findByEmail(todoDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!todo.getUser().getEmail().equals(user.getEmail())) {
            throw new RuntimeException("You don't have permission to update this todo");
        }

        todo.setCategory(todoDTO.getCategory());
        todo.setContent(todoDTO.getContent());
        todo.setDone(todoDTO.isDone());
        todo.setTodoDate(todoDTO.getTodoDate());

        Todo updatedTodo = todoRepository.save(todo);

        TodoDTO resultDTO = modelMapper.map(updatedTodo, TodoDTO.class);
        resultDTO.setEmail(user.getEmail());
        resultDTO.setUserNickName(user.getNickName());

        return resultDTO;
    }

    public void deleteTodo(int id, String email) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        if (!todo.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You don't have permission to delete this todo");
        }
        todoRepository.delete(todo);
    }

    public List<TodoDTO> getTodoByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Todo> todos = todoRepository.findByUser(user);
        return todos.stream()
                .map(todo -> TodoDTO.builder()
                        .id(todo.getId())
                        .email(todo.getUser().getEmail())
                        .category(todo.getCategory())
                        .content(todo.getContent())
                        .done(todo.isDone())
                        .todoDate(todo.getTodoDate())
                        .userNickName(todo.getUser().getNickName())
                        .build())
                .collect(Collectors.toList());
    }
}
