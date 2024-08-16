import { useState, useEffect } from 'react';
import { callApi, TodoModel } from "../models/todoModels";

export function useTodoViewModel() {
    const [items, setItems] = useState({});

    const fetchTodos = async () => {
        try {
            const response = await callApi("/todo", "GET", null);
            if (typeof response === 'object' && response !== null) {
                setItems(response);
            } else {
                console.error("Unexpected response structure:", response);
                setItems({});
            }
        } catch (error) {
            console.error("Failed to fetch todos:", error);
            setItems({});
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async (item) => {
        try {
            await callApi("/todo", "POST", item);
            fetchTodos();
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const deleteTodo = async (item) => {
        try {
            await callApi("/todo", "DELETE", item);
            fetchTodos();
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const updateTodo = async (item) => {
        try {
            await callApi(`/todo`, "PUT", item);
            fetchTodos();
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };

    return { items, addTodo, deleteTodo, updateTodo };
}