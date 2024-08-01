import { useState, useEffect } from 'react';
import { callApi, TodoModel } from "../models/todoModels";

export function useTodoViewModel() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await callApi("/todo", "GET", null);
            setItems(response.data.map(item => new TodoModel(item.id, item.title, item.done)));
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        }
    };

    const addTodo = async (item) => {
        try {
            const response = await callApi("/todo", "POST", item);
            setItems(response.data.map(item => new TodoModel(item.id, item.title, item.done)));
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const deleteTodo = async (item) => {
        try {
            const response = await callApi("/todo", "DELETE", item);
            setItems(response.data.map(item => new TodoModel(item.id, item.title, item.done)));
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const updateTodo = async (item) => {
        try {
            const response = await callApi("/todo", "PUT", item);
            setItems(response.data.map(item => new TodoModel(item.id, item.title, item.done)));
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };

    return { items, addTodo, deleteTodo, updateTodo };
}