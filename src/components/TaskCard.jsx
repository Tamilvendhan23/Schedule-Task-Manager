import React from 'react';
import { FaExternalLinkAlt, FaEdit, FaTrash, FaCheckCircle, FaTrophy, FaFire } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useTasks } from '../context/TaskContext';
import { motion } from 'framer-motion';

function TaskCard({ task }) {
  const { incrementTaskOpen, openTaskPanel, confirmDeleteTask, TASK_STATUS, PRIORITY_LEVELS } = useTasks();

  const handleOpenLink = () => {
    incrementTaskOpen(task.id);
    window.open(task.link, '_blank');
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getProgressColor = () => {
    if (!task.dailyGoal) return 'bg-gray-200 dark:bg-gray-700';
    const percentage = (task.openedToday / task.dailyGoal) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case TASK_STATUS.COMPLETED:
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>;
      case TASK_STATUS.IN_PROGRESS:
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">In Progress</span>;
      case TASK_STATUS.PENDING:
      default:
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Pending</span>;
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case PRIORITY_LEVELS.HIGH:
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs ml-2">High Priority</span>;
      case PRIORITY_LEVELS.MEDIUM:
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs ml-2">Medium</span>;
      case PRIORITY_LEVELS.LOW:
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs ml-2">Low</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      variants={item}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {task.imagePreview && (
        <div className="h-40 overflow-hidden">
          <img 
            src={task.imagePreview} 
            alt={task.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://dummyimage.com/400x200/ccc/000&text=${task.name}`;
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold dark:text-white">{task.name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {getStatusBadge()}
              {getPriorityBadge()}
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => openTaskPanel(task)}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              aria-label="Edit task"
            >
              <FaEdit size={18} />
            </button>
            <button 
              onClick={() => confirmDeleteTask(task.id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              aria-label="Delete task"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm italic">"{task.moto}"</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Daily progress: {task.openedToday} / {task.dailyGoal}</span>
            {task.openedToday >= task.dailyGoal && (
              <span className="flex items-center text-green-500">
                <FaCheckCircle className="mr-1" /> Complete
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className={`h-2.5 rounded-full ${getProgressColor()}`} 
              style={{ width: `${Math.min((task.openedToday / task.dailyGoal) * 100, 100)}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((task.openedToday / task.dailyGoal) * 100, 100)}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p>Total visits: {task.totalOpened || 0}</p>
          {task.lastOpened && (
            <p>Last visited: {formatDistanceToNow(new Date(task.lastOpened))} ago</p>
          )}
          {task.dueDate && (
            <p className="mt-1 font-semibold">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          {task.category && (
            <p className="mt-1">
              Category: <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded text-xs">{task.category}</span>
            </p>
          )}
        </div>
        
        <button
          onClick={handleOpenLink}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaExternalLinkAlt /> Visit Link
        </button>
      </div>
    </motion.div>
  );
}

export default TaskCard;