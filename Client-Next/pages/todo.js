import { useTodoViewModel } from '@/todo/viewmodels/todoViewModels';
import Todo from '@/todo/components/todo';
import AddTodo from '@/todo/components/AddTodo';
import React, { useState, useEffect } from 'react';
import { Container, Paper, List, Grid, TextField, Select, MenuItem, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import 'react-calendar/dist/Calendar.css';
import MyCalendar from '@/todo/components/Calendar';

function TodoPage() {
    const { items, addTodo, deleteTodo, updateTodo } = useTodoViewModel();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tutorialDone, setTutorialDone] = useState(true); // 튜토리얼 상태
    const [tutorialImage, setTutorialImage] = useState('/assets/1_MAIN.png');

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일(${['일', '월', '화', '수', '목', '금', '토'][currentDate.getDay()]})`;
        setSelectedDate(currentDate);
    }, []);

    const changeTutorialImage = (direction) => {
        // 튜토리얼 이미지 변경 로직
    };

    const handleTutorialDone = () => {
        setTutorialDone(true);
        // 서버에 튜토리얼 완료 상태 전송
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log('Selected date:', date);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Do-Tori
            </Typography>
            <a href="/posts" style={{ textDecoration: 'none', color: '#7D625B', flex: '1', textAlign: 'right'}}> go To-rest → </a>

            {!tutorialDone && (
                <div className="tutorial-design">
                    <div className="tutorial-content">
                        <div className="image-container">
                            <span className="arrow arrow-left" onClick={() => changeTutorialImage(-1)}>&lt;</span>
                            <img src={tutorialImage} alt="Tutorial" id="tutorialImage" width="80%" />
                            <span className="arrow arrow-right" onClick={() => changeTutorialImage(1)}>&gt;</span>
                        </div>
                        <Button variant="contained" onClick={handleTutorialDone} style={{ backgroundColor: '#7D625B', marginTop: '10px' }}>
                            튜토리얼 완료
                        </Button>
                    </div>
                </div>
            )}

            <Grid container spacing={2}>
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
                        <AddTodo add={addTodo} todoDate={selectedDate}/>
                        <div className="todolist-content">
                            <List>
                                {items.map((item) => (
                                    <Todo 
                                        item={item} 
                                        key={item.id} 
                                        delete={deleteTodo}
                                        update={updateTodo}
                                    />
                                ))}
                            </List>
                        </div>
                    </div>
                    <div className="habit-container">
                        {/* 습관 트래커 컴포넌트 추가 */}
                        <div id="contribution">
                            <div className="month-label"></div>
                        </div>
                        <div className="habbit-contents">
                            <div id="habbit-tracker"></div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );   
}

export default TodoPage;
