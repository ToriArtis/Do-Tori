import { useTodoViewModel } from '@/todo/viewmodels/todoViewModels';
import Todo from '@/todo/components/todo';
import AddTodo from '@/todo/components/AddTodo';
import React, { useState, useEffect } from 'react';
import { Container, Paper, List, Grid, TextField, Select, MenuItem, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import styles from './styles/Calendar.module.css';


function TodoPage() {
    const { items, addTodo, deleteTodo, updateTodo } = useTodoViewModel();
    const [selectedDate, setSelectedDate] = useState('');
    const [tutorialDone, setTutorialDone] = useState(true); // 튜토리얼 상태
    const [tutorialImage, setTutorialImage] = useState('/assets/1_MAIN.png');

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일(${['일', '월', '화', '수', '목', '금', '토'][currentDate.getDay()]})`;
        setSelectedDate(formattedDate);
    }, []);

    const changeTutorialImage = (direction) => {
        // 튜토리얼 이미지 변경 로직
    };

    const handleTutorialDone = () => {
        setTutorialDone(true);
        // 서버에 튜토리얼 완료 상태 전송
    };

    const [date, setDate] = useState(new Date());

    const onChange = (date) => {
      setDate(date);
    };
    
    return (
        <>
        <div style={{ backgroundColor: '#F5F0EA' }}>
        
        <Container maxWidth="lg" >
            
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
                    <Paper elevation={3} style={{ padding: '30px', borderRadius: '5%', backgroundColor: '#ffffff', margin: '20px 20px 0px -20px', height: 'auto' }}>
                        {/* 캘린더 컴포넌트 추가 */}
                        
                        <Calendar
                            onChange={onChange}
                            value={date}
                            locale="ko-KR"
                            className={styles.reactCalendar} />
                        <p>Selected date: {date.toDateString()}</p>
                        <div id="calendar"></div>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className="todolist-container">
                        <Typography variant="h4" style={{ margin: '20px 0px 22px 0px', fontWeight: 'bolder' }}>
                            {selectedDate}
                        </Typography>
                        <AddTodo add={addTodo} />
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
        </div>
        </>
    );   
}

export default TodoPage;