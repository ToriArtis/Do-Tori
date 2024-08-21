import React, { useState } from 'react';
import { Container, Grid, Typography, List } from '@mui/material';
import styled, { ThemeProvider } from 'styled-components';
import MyCalendar from '@/todo/components/Calendar';
import Todo from '@/todo/components/todo';
import AddTodo from '@/todo/components/AddTodo';
import { useTodoViewModel } from '@/todo/viewmodels/todoViewModels';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useTheme } from '../src/components/ThemeContext';

const PageContainer = styled.div`
  background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#F5F0EA'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  min-height: 100vh;
  padding-top: 20px;
  margin-left: ${props => props.isSidebarOpen ? '250px' : '0'};
  transition: margin-left 0.3s ease-in-out, background-color 0.3s ease;
`;

const StyledContainer = styled(Container)`
  background-color: ${props => props.isDarkMode ? '#2c2c2c' : '#F5F0EA'};
  padding: 20px;
`;

const Title = styled(Typography)`
  font-weight: bold;
  margin-bottom: 20px;
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.isDarkMode ? '#64ffda' : '#0070f3'};
  &:hover {
    text-decoration: underline;
  }
`;

const TodoListContainer = styled.div`
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
`;

function TodoPage() {
    const { items, addTodo, deleteTodo, updateTodo } = useTodoViewModel();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isDarkMode } = useTheme();
    
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
        <ThemeProvider theme={{ isDarkMode }}>
            <Sidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <PageContainer isSidebarOpen={isSidebarOpen} isDarkMode={isDarkMode}>
                <StyledContainer maxWidth="lg" isDarkMode={isDarkMode}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Title variant="h4" isDarkMode={isDarkMode}>Do-Tori</Title>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
                            <StyledLink href='/posts' isDarkMode={isDarkMode}>
                                <Typography>go To-rest →</Typography>
                            </StyledLink>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Title variant="h5" isDarkMode={isDarkMode}>
                                {selectedDate.getFullYear()}
                            </Title>
                            <MyCalendar onDateChange={handleDateChange} isDarkMode={isDarkMode} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Title variant="h5" isDarkMode={isDarkMode}>
                                {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                                ({['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]})
                            </Title>
                            <AddTodo add={addTodo} todoDate={selectedDate} isDarkMode={isDarkMode} />
                            <TodoListContainer>
                                {Object.entries(filteredItems).map(([category, todoList]) => (
                                    <div key={category}>
                                        <Typography variant="h6" style={{ marginTop: '20px', color: isDarkMode ? '#ffffff' : '#000000' }}>
                                            {category}
                                        </Typography>
                                        <List>
                                            {todoList.map((item) => (
                                                <Todo 
                                                    item={item} 
                                                    key={item.id} 
                                                    delete={deleteTodo}
                                                    update={updateTodo}
                                                    isDarkMode={isDarkMode}
                                                />
                                            ))}
                                        </List>
                                    </div>
                                ))}
                            </TodoListContainer>
                        </Grid>
                    </Grid>
                </StyledContainer>
            </PageContainer>
        </ThemeProvider>
    );   
}

export default TodoPage;