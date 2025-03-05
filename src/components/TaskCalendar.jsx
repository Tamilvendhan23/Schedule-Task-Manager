import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { HiChevronLeft, HiChevronRight, HiCalendar, HiPlus } from 'react-icons/hi';
import { motion } from 'framer-motion';

function TaskCalendar({ className = '' }) {
  const { tasks, openTaskPanel } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiChevronLeft size={24} className="dark:text-white" />
        </button>
        <h2 className="text-xl font-bold dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <HiChevronRight size={24} className="dark:text-white" />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center py-2 font-semibold text-gray-600 dark:text-gray-300">
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate
    });
    
    // Group tasks by date
    const tasksByDate = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
        if (!tasksByDate[dateKey]) {
          tasksByDate[dateKey] = [];
        }
        tasksByDate[dateKey].push(task);
      }
    });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {dateRange.map((day, i) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const tasksForDay = tasksByDate[dateKey] || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={i}
              className={`min-h-[100px] p-2 border rounded-lg ${
                isCurrentMonth 
                  ? 'bg-white dark:bg-gray-800' 
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
              } ${
                isToday 
                  ? 'border-blue-500 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${
                  isToday ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                {isCurrentMonth && (
                  <button
                    onClick={() => {
                      const newTask = {
                        dueDate: day.toISOString()
                      };
                      openTaskPanel(newTask);
                    }}
                    className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                    title="Add task for this day"
                  >
                    <HiPlus size={16} />
                  </button>
                )}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {tasksForDay.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs p-1 rounded truncate ${
                      task.priority === 'high' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                        : task.priority === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    }`}
                    onClick={() => openTaskPanel(task)}
                  >
                    {task.name}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold dark:text-white">Task Calendar</h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiCalendar className="mr-1" />
          <span>Tasks with due dates are shown here</span>
        </div>
      </div>
      
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default TaskCalendar;