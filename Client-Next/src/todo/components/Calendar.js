import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../components/css/Calendar.module.css';

const MyCalendar = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate); // Call the provided callback with the new date
    }
  };

  const formatDate = (date) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일(${weekday})`;
  };

  return (
    <div className={styles.calendarContainer}> {/* Applying CSS module class */}
      <Calendar
        onChange={handleDateChange}
        value={date}
        locale="ko-KR" // Ensure locale is correctly set
      />
    </div>
  );
};

export default MyCalendar;
