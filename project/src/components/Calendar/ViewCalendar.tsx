import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

export default function ViewCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const header = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-4">
        <button onClick={prevMonth} className="text-lg font-bold">{'<'}</button>
        <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={nextMonth} className="text-lg font-bold">{'>'}</button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const days = [];
    const date = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-gray-500">
          {format(addDays(date, i), 'EEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-2 px-2">{days}</div>;
  };

  const calendarCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`h-14 flex items-center justify-center rounded-lg cursor-pointer
              ${!isSameMonth(day, monthStart) ? 'text-gray-300' : ''}
              ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white' : ''}
              ${isToday && !isSameDay(day, selectedDate) ? 'border border-blue-500' : ''}
              hover:bg-blue-100 transition-all`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-2" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="mt-2">{rows}</div>;
  };

  const tasksForSelectedDate = () => {
    // Replace with dynamic tasks using API later
    const sampleTasks = {
      '2025-07-28': ['Meeting with Designer', 'Send invoice to client'],
      '2025-07-30': ['Fix calendar bug', 'Write blog post'],
    };
    const key = format(selectedDate, 'yyyy-MM-dd');
    return sampleTasks[key] || ['No tasks for this day'];
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">📅 View Calendar</h1>
        <p className="text-gray-600 dark:text-gray-400">Select a date to view your tasks</p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {header()}
        {daysOfWeek()}
        {calendarCells()}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          Tasks on {format(selectedDate, 'MMMM dd, yyyy')}:
        </h3>
        <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-100">
          {tasksForSelectedDate().map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
