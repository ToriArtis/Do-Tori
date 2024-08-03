import React, { useState } from 'react';
import Calendar from 'react-calendar';

const MyCalendar = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
    onDateChange(date); // Pass the selected date to the parent component
  };

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={date}
        locale="ko-KR"
      />
      
    </div>
  );
};

export default MyCalendar;
