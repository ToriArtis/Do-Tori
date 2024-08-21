import { useState, useEffect } from 'react';
import todoModels, { callApi, TodoModel } from "../models/todoModels";

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
             // Adjust the category handling
            const category = item.category ? item.category : "no category";

            // Adjust the time (adding 9 hours)
            const todoDate = new Date(item.todoDate);
            todoDate.setHours(todoDate.getHours() + 9);

            // Create the new TodoModel
            const itemTodo = new TodoModel(
                item.id,
                item.content,
                category,
                item.done,
                todoDate
            );
            await callApi("/todo", "POST", itemTodo);
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