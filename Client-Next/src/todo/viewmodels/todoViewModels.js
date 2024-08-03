import { useState, useEffect } from 'react';
import { callApi, TodoModel } from "../models/todoModels";

export function useTodoViewModel() {
    const [items, setItems] = useState([]);

    const fetchTodos = async () => {
        try {
            const response = await callApi("/todo", "GET", null);
            if (Array.isArray(response)) {
                setItems(response.map(item => new TodoModel(item.id, item.content, item.category, item.done)));
            } else {
                console.error("Unexpected response structure:", response);
                setItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch todos:", error);
            setItems([]);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async (item) => {
        try {
            await callApi("/todo", "POST", item);
            fetchTodos(); // 추가 후 전체 목록 다시 불러오기
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const deleteTodo = async (item) => {
        try {
            await callApi("/todo", "DELETE", item);
            fetchTodos(); // 삭제 후 전체 목록 다시 불러오기
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const updateTodo = async (item) => {
        try {
            await callApi(`/todo`, "PUT", item);
            fetchTodos(); // 업데이트 후 전체 목록 다시 불러오기
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };

    return { items, addTodo, deleteTodo, updateTodo };
}