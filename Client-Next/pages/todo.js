import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, List } from '@mui/material';
import MyCalendar from '@/todo/components/Calendar';
import Todo from '@/todo/components/todo';
import AddTodo from '@/todo/components/AddTodo';
import { useTodoViewModel } from '@/todo/viewmodels/todoViewModels';
import Sidebar from '@/components/Sidebar';

function TodoPage() {
    const { items, addTodo, deleteTodo, updateTodo } = useTodoViewModel();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filterItemsByDate = (items, date) => {
        const normalizeDate = (date) => {
            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);
            return normalizedDate.toISOString().split('T')[0];
        };

        const normalizedSelectedDate = normalizeDate(date);

        const filteredItems = {};
        Object.entries(items).forEach(([category, todoList]) => {
            const filteredTodoList = todoList.filter(todo => 
                normalizeDate(todo.todoDate) === normalizedSelectedDate
            );
            if (filteredTodoList.length > 0) {
                filteredItems[category] = filteredTodoList;
            }
        });

        return filteredItems;
    };

    const filteredItems = filterItemsByDate(items, selectedDate);

    return (
        <Container maxWidth="lg">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        Do-Tori
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography gutterBottom>
                        <a href='/posts'>go To-rest →</a>
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" style={{ margin: '20px 0px 22px 0px', fontWeight: 'bolder' }}>
                        {selectedDate.getFullYear()}
                    </Typography>

                    <MyCalendar onDateChange={handleDateChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className="todolist-container">
                        <Typography variant="h4" style={{ margin: '20px 0px 22px 0px', fontWeight: 'bolder' }}>
                            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일({['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]})
                        </Typography>
                        <AddTodo add={addTodo} todoDate={selectedDate} />
                        <div className="todolist-content">
                            {Object.entries(filteredItems).map(([category, todoList]) => (
                                <div key={category}>
                                    <Typography variant="h6">{category}</Typography>
                                    <List>
                                        {todoList.map((item) => (
                                            <Todo 
                                                item={item} 
                                                key={item.id} 
                                                delete={deleteTodo}
                                                update={updateTodo}
                                            />
                                        ))}
                                    </List>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );   
}

export default TodoPage;