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
            if (Array.isArray(response)) {
                setItems(response.map(item => new TodoModel(item.id,  item.content, item.category, item.done)));
            } else {
                console.error("Unexpected response structure:", response);
                setItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch todos:", error);
            setItems([]);
        }
    };

    const addTodo = async (item) => {
        try {
            const response = await callApi("/todo", "POST", item);
            console.log("API Response:", response); // Log response to understand its structure
    
            if (response && response.id) {
                // Assuming response is a single todo item
                setItems([new TodoModel(response.id, response.content, response.category, response.done)]);
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };
    
    const deleteTodo = async (item) => {
        try {
            const response = await callApi("/todo", "DELETE", item);
            if (Array.isArray(response)) {
                setItems(response.map(item => new TodoModel(item.id, item.category, item.content, item.done)));
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    const updateTodo = async (item) => {
        try {
            // Correctly using template literals
            const response = await callApi(`/todo`, "PUT", item);
        
            if (response && response.id) {
                // Handle single item response
                setItems([new TodoModel(response.id, response.category, response.content, response.done)]);
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };

    
    return { items, addTodo, deleteTodo, updateTodo };
}