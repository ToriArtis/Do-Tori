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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;
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
        Auth auth = getLoginUser();

        Todo todo = modelMapper.map(todoDTO, Todo.class);
        todo.setAuth(auth);

        Todo savedTodo = todoRepository.save(todo);

        TodoDTO resultDTO = modelMapper.map(savedTodo, TodoDTO.class);

        return resultDTO;
    }

    public List<TodoDTO> getAllTodo() {
        Auth auth = getLoginUser();
        List<Todo> todos = todoRepository.findByAuth(auth);
        return todoRepository.findAll().stream()
                .map(todo -> modelMapper.map(todo, TodoDTO.class))
                .collect(Collectors.toList());
    }


    public TodoDTO updateTodo(TodoDTO todoDTO) {

        // Fetch the existing Todo from the database
        Todo todo = todoRepository.findById(todoDTO.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        // Fetch the currently logged-in user
        Auth auth = getLoginUser();

        // Check if the logged-in user has permission to update the Todo
        if (!todo.getAuth().getEmail().equals(auth.getEmail())) {
            throw new RuntimeException("You don't have permission to update this todo");
        }

        // Update the Todo fields with the data from the provided TodoDTO
        todo.setCategory(todoDTO.getCategory());
        todo.setContent(todoDTO.getContent());
        todo.setDone(todoDTO.isDone());
        todo.setTodoDate(todoDTO.getTodoDate());

        // Save the updated Todo entity to the database
        Todo updatedTodo = todoRepository.save(todo);
        log.info("Updated todo: {}", updatedTodo);

        // Map the updated Todo entity back to a TodoDTO
        TodoDTO resultDTO = modelMapper.map(updatedTodo, TodoDTO.class);
        log.info("updatedTodo : {}", resultDTO.toString());

        return resultDTO;
    }

    public TodoDTO deleteTodo(int id) {
        Auth auth = getLoginUser();
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        if (!todo.getAuth().equals(auth)) {
            throw new RuntimeException("You don't have permission to delete this todo");
        }
        todoRepository.delete(todo);
        return TodoDTO.builder().id(id).build();
    }


    public Auth getLoginUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        Optional<Auth> user = authRepository.findByEmail(name);
        return user.orElseThrow(() -> new RuntimeException("user not found"));
    }

}
