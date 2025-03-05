import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { HiFilter, HiSearch, HiChartBar, HiCalendar, HiTag } from 'react-icons/hi';
import TaskStats from './TaskStats';
import TaskCalendar from './TaskCalendar';
import AchievementBanner from './AchievementBanner';

function TaskGrid() {
  const { 
    filterOptions, 
    setFilterOptions, 
    getFilteredTasks, 
    TASK_STATUS, 
    PRIORITY_LEVELS,
    userStats
  } = useTasks();
  
  const [showStats, setShowStats] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredTasks = getFilteredTasks();
  const categories = ['all', ...new Set(filteredTasks.map(task => task.category).filter(Boolean))];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    setFilterOptions(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const toggleStats = () => {
    setShowStats(prev => !prev);
    if (showCalendar) setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
    if (showStats) setShowStats(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilterOptions(prev => ({
      ...prev,
      category: category === 'all' ? '' : category
    }));
  };

  return (
    <section id="task-grid" className="py-10">
      {userStats.currentStreak > 0 && (
        <AchievementBanner 
          streak={userStats.currentStreak} 
          achievements={userStats.achievements}
        />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center md:text-left dark:text-white mb-4 md:mb-0">Your Tasks</h2>
        
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={toggleStats}
            className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <HiChartBar size={20} /> {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          
          <button
            onClick={toggleCalendar}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <HiCalendar size={20} /> {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filterOptions.searchTerm}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      {showStats && <TaskStats className="mb-8" />}
      {showCalendar && <TaskCalendar className="mb-8" />}
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <HiFilter className="mr-2 text-gray-600 dark:text-gray-300" size={20} />
            <span className="text-gray-700 dark:text-gray-300 mr-2">Filter:</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
            <select
              name="status"
              value={filterOptions.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value={TASK_STATUS.PENDING}>Pending</option>
              <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={TASK_STATUS.COMPLETED}>Completed</option>
            </select>
            
            <select
              name="priority"
              value={filterOptions.priority}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value={PRIORITY_LEVELS.HIGH}>High Priority</option>
              <option value={PRIORITY_LEVELS.MEDIUM}>Medium Priority</option>
              <option value={PRIORITY_LEVELS.LOW}>Low Priority</option>
            </select>
            
            <select
              name="sortBy"
              value={filterOptions.sortBy}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date Added</option>
              <option value="openCount">Sort by Open Count</option>
              <option value="lastOpened">Sort by Last Opened</option>
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
            </select>
            
            <select
              name="sortDirection"
              value={filterOptions.sortDirection}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        {categories.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center">
              <HiTag className="mr-2 text-gray-600 dark:text-gray-300" size={18} />
              <span className="text-gray-700 dark:text-gray-300 mr-2">Categories:</span>
            </div>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            {filterOptions.searchTerm || filterOptions.status !== 'all' || filterOptions.priority !== 'all'
              ? 'No tasks match your current filters.' 
              : 'You don\'t have any tasks yet. Click "Add Task" to get started!'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
          layout
        >
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}

export default TaskGrid;