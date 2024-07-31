package com.dotori.dotori.todo.repository;

import com.dotori.dotori.auth.entity.Auth;
import com.dotori.dotori.todo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Integer> {
    List<Todo> findByAuth(Auth auth);
}