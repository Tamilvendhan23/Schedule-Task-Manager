import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { format, startOfWeek, startOfMonth, isWithinInterval, subDays, isSameDay, differenceInDays } from 'date-fns';

const TaskContext = createContext();

// Task status options
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Achievement definitions
export const ACHIEVEMENTS = [
  { id: 'streak-3', name: '3-Day Streak', description: 'Complete tasks for 3 consecutive days', threshold: 3, icon: '🔥' },
  { id: 'streak-7', name: '7-Day Streak', description: 'Complete tasks for 7 consecutive days', threshold: 7, icon: '🔥' },
  { id: 'streak-14', name: '14-Day Streak', description: 'Complete tasks for 14 consecutive days', threshold: 14, icon: '🔥' },
  { id: 'streak-30', name: 'Monthly Master', description: 'Complete tasks for 30 consecutive days', threshold: 30, icon: '🏆' },
  { id: 'tasks-10', name: 'Getting Started', description: 'Complete 10 tasks', threshold: 10, icon: '🚀' },
  { id: 'tasks-50', name: 'Productivity Pro', description: 'Complete 50 tasks', threshold: 50, icon: '⭐' },
  { id: 'tasks-100', name: 'Task Champion', description: 'Complete 100 tasks', threshold: 100, icon: '👑' },
  { id: 'perfect-week', name: 'Perfect Week', description: 'Complete all tasks for 7 consecutive days', threshold: 7, icon: '📅' },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    status: 'all',
    priority: 'all',
    category: '',
    sortBy: 'name',
    sortDirection: 'asc',
    searchTerm: ''
  });
  
  // User streak and achievements
  const [userStats, setUserStats] = useState(() => {
    const savedStats = localStorage.getItem('userStats');
    return savedStats ? JSON.parse(savedStats) : {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      totalTasksCompleted: 0,
      achievements: [],
      perfectDays: 0,
      reminderPreferences: {
        morning: true,
        afternoon: true,
        evening: true,
        preferredTimes: ['09:00', '13:00', '18:00'],
      },
      activityPatterns: {
        mostProductiveHour: null,
        mostProductiveDay: null,
        completionRates: {
          morning: 0,
          afternoon: 0,
          evening: 0
        }
      }
    };
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save user stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Check for daily reminders
  useEffect(() => {
    const lastReminderDate = localStorage.getItem('lastReminderDate');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastReminderDate !== today && tasks.length > 0) {
      const pendingTasks = tasks.filter(task => 
        !task.openedToday || task.openedToday < task.dailyGoal
      );
      
      if (pendingTasks.length > 0) {
        const highPriorityTasks = pendingTasks.filter(task => task.priority === PRIORITY_LEVELS.HIGH);
        
        if (highPriorityTasks.length > 0) {
          toast.error(`You have ${highPriorityTasks.length} high priority tasks pending!`, {
            onClick: () => {
              window.scrollTo({
                top: document.getElementById('task-grid').offsetTop - 100,
                behavior: 'smooth'
              });
            }
          });
        } else {
          toast.info(`You have ${pendingTasks.length} pending tasks for today!`, {
            onClick: () => {
              window.scrollTo({
                top: document.getElementById('task-grid').offsetTop - 100,
                behavior: 'smooth'
              });
            }
          });
        }
      }
      
      localStorage.setItem('lastReminderDate', today);
    }
  }, [tasks]);

  // Reset daily counters at midnight and update streak
  useEffect(() => {
    const resetDailyCounts = () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastResetDate = localStorage.getItem('lastResetDate');
      
      if (lastResetDate !== today) {
        // Reset daily counts
        setTasks(prevTasks => 
          prevTasks.map(task => ({
            ...task,
            openedToday: 0
          }))
        );
        
        // Update streak
        updateStreak();
        
        localStorage.setItem('lastResetDate', today);
      }
    };

    resetDailyCounts();
    
    // Check every hour if we need to reset
    const interval = setInterval(resetDailyCounts, 3600000);
    return () => clearInterval(interval);
  }, []);
  
  // Intelligent reminder system
  useEffect(() => {
    // Schedule reminders based on user preferences
    const scheduleReminders = () => {
      const { reminderPreferences } = userStats;
      const now = new Date();
      const currentHour = now.getHours();
      const currentTime = format(now, 'HH:mm');
      
      // Check for custom reminder times
      if (reminderPreferences.preferredTimes.includes(currentTime)) {
        const pendingTasks = tasks.filter(task => 
          !task.openedToday || task.openedToday < task.dailyGoal
        );
        
        if (pendingTasks.length > 0) {
          // Find the highest priority pending task
          const highestPriorityTask = pendingTasks.reduce((prev, current) => {
            if (current.priority === PRIORITY_LEVELS.HIGH) return current;
            if (current.priority === PRIORITY_LEVELS.MEDIUM && prev.priority !== PRIORITY_LEVELS.HIGH) return current;
            return prev;
          }, pendingTasks[0]);
          
          toast.info(`Reminder: "${highestPriorityTask.name}" needs your attention!`, {
            autoClose: 10000,
            onClick: () => {
              window.scrollTo({
                top: document.getElementById('task-grid').offsetTop - 100,
                behavior: 'smooth'
              });
            }
          });
        }
      }
      
      // Morning reminder (8-10 AM)
      if (reminderPreferences.morning && currentHour >= 8 && currentHour <= 10) {
        const pendingTasks = tasks.filter(task => 
          !task.openedToday || task.openedToday < task.dailyGoal
        );
        
        if (pendingTasks.length > 0) {
          toast.info("Good morning! Don't forget to work on your tasks today.", {
            autoClose: 10000
          });
        }
      }
      
      // Afternoon reminder (12-14 PM)
      if (reminderPreferences.afternoon && currentHour >= 12 && currentHour <= 14) {
        const pendingTasks = tasks.filter(task => 
          !task.openedToday || task.openedToday < task.dailyGoal
        );
        
        // if (pendingTasks.length > 0) {
        //   toast.info(`You still have ${pendingTasks.length} tasks to complete today!`, {
        //     autoClose: 10000
        //   });
        // }
      }
      
      // Evening reminder (17-19 PM)
      if (reminderPreferences.evening && currentHour >= 17 && currentHour <= 19) {
        const pendingTasks = tasks.filter(task => 
          !task.openedToday || task.openedToday < task.dailyGoal
        );
        
        if (pendingTasks.length > 0) {
          toast.warning(`Don't break your ${userStats.currentStreak}-day streak! You have ${pendingTasks.length} tasks left.`, {
            autoClose: 10000
          });
        }
      }
      
      // Task-specific reminders
      tasks.forEach(task => {
        if (task.reminderTime && task.reminderTime === currentTime && (!task.openedToday || task.openedToday < task.dailyGoal)) {
          toast.info(`Time to work on "${task.name}"!`, {
            autoClose: 10000,
            onClick: () => {
              window.open(task.link, '_blank');
              incrementTaskOpen(task.id);
            }
          });
        }
      });
    };
    
    // Check for reminders every minute
    const reminderInterval = setInterval(scheduleReminders, 60000);
    
    // Initial check
    scheduleReminders();
    
    return () => clearInterval(reminderInterval);
  }, [tasks, userStats]);

  // Update streak based on task completion
  const updateStreak = () => {
    setUserStats(prevStats => {
      const today = new Date();
      const lastCompletionDate = prevStats.lastCompletionDate 
        ? new Date(prevStats.lastCompletionDate) 
        : null;
      
      // Check if any tasks were completed today
      const tasksCompletedToday = tasks.some(task => 
        task.openedToday >= task.dailyGoal
      );
      
      // Check if all tasks were completed today
      const allTasksCompletedToday = tasks.length > 0 && tasks.every(task => 
        task.openedToday >= task.dailyGoal
      );
      
      let newStreak = prevStats.currentStreak;
      let perfectDays = prevStats.perfectDays || 0;
      
      if (tasksCompletedToday) {
        // If last completion was yesterday, increment streak
        if (lastCompletionDate && differenceInDays(today, lastCompletionDate) === 1) {
          newStreak += 1;
        } 
        // If last completion was today, maintain streak
        else if (lastCompletionDate && isSameDay(today, lastCompletionDate)) {
          // Streak stays the same
        } 
        // Otherwise, reset streak to 1
        else {
          newStreak = 1;
        }
        
        // Update perfect days count
        if (allTasksCompletedToday) {
          perfectDays += 1;
        }
      } 
      // If no tasks completed today and last completion wasn't yesterday, reset streak
      else if (!lastCompletionDate || differenceInDays(today, lastCompletionDate) > 1) {
        newStreak = 0;
      }
      
      // Check for new achievements
      const newAchievements = [...prevStats.achievements];
      
      // Streak achievements
      ACHIEVEMENTS.filter(a => a.id.startsWith('streak-')).forEach(achievement => {
        if (newStreak >= achievement.threshold && !newAchievements.includes(achievement.id)) {
          newAchievements.push(achievement.id);
          toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`, {
            autoClose: 5000
          });
        }
      });
      
      // Task completion achievements
      const totalCompleted = prevStats.totalTasksCompleted;
      ACHIEVEMENTS.filter(a => a.id.startsWith('tasks-')).forEach(achievement => {
        if (totalCompleted >= achievement.threshold && !newAchievements.includes(achievement.id)) {
          newAchievements.push(achievement.id);
          toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`, {
            autoClose: 5000
          });
        }
      });
      
      // Perfect week achievement
      if (perfectDays >= 7 && !newAchievements.includes('perfect-week')) {
        newAchievements.push('perfect-week');
        toast.success(`🎉 Achievement Unlocked: Perfect Week!`, {
          autoClose: 5000
        });
      }
      
      return {
        ...prevStats,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prevStats.longestStreak),
        lastCompletionDate: tasksCompletedToday ? today.toISOString() : prevStats.lastCompletionDate,
        achievements: newAchievements,
        perfectDays
      };
    });
  };

  // Update activity patterns for intelligent reminders
  const updateActivityPatterns = (taskId) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';
    
    setUserStats(prev => {
      // Count completions by time of day
      const completionRates = { ...prev.activityPatterns.completionRates };
      completionRates[timeOfDay] += 1;
      
      // Determine most productive hour and day
      const hourCounts = prev.activityPatterns.hourCounts || {};
      hourCounts[currentHour] = (hourCounts[currentHour] || 0) + 1;
      
      const dayCounts = prev.activityPatterns.dayCounts || {};
      dayCounts[currentDay] = (dayCounts[currentDay] || 0) + 1;
      
      // Find most productive hour and day
      let mostProductiveHour = prev.activityPatterns.mostProductiveHour;
      let mostProductiveDay = prev.activityPatterns.mostProductiveDay;
      
      if (!mostProductiveHour || hourCounts[currentHour] > hourCounts[mostProductiveHour]) {
        mostProductiveHour = currentHour;
      }
      
      if (!mostProductiveDay || dayCounts[currentDay] > dayCounts[mostProductiveDay]) {
        mostProductiveDay = currentDay;
      }
      
      return {
        ...prev,
        activityPatterns: {
          ...prev.activityPatterns,
          mostProductiveHour,
          mostProductiveDay,
          completionRates,
          hourCounts,
          dayCounts
        }
      };
    });
  };

  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      name: taskData.name,
      link: taskData.link,
      moto: taskData.moto,
      dailyGoal: taskData.dailyGoal || 1,
      openedToday: 0,
      totalOpened: 0,
      lastOpened: null,
      createdAt: new Date().toISOString(),
      imagePreview: taskData.imagePreview || null,
      status: taskData.status || TASK_STATUS.PENDING,
      priority: taskData.priority || PRIORITY_LEVELS.MEDIUM,
      dueDate: taskData.dueDate || null,
      recurring: taskData.recurring || null,
      category: taskData.category || null,
      notes: taskData.notes || '',
      reminderTime: taskData.reminderTime || null
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success('Task added successfully!');
    return newTask;
  };

  const updateTask = (id, updatedData) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updatedData } : task
      )
    );
    toast.success('Task updated successfully!');
  };

  const confirmDeleteTask = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
    toast.success('Task deleted successfully!');
  };

  const cancelDeleteTask = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const incrementTaskOpen = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          const now = new Date().toISOString();
          const newOpenedToday = (task.openedToday || 0) + 1;
          const wasCompleted = task.status === TASK_STATUS.COMPLETED;
          
          // Auto-update status based on progress
          let newStatus = task.status;
          if (newOpenedToday >= task.dailyGoal && task.status !== TASK_STATUS.COMPLETED) {
            newStatus = TASK_STATUS.COMPLETED;
            
            // If this is the first time the task is completed, increment total completed
            if (!wasCompleted) {
              setUserStats(prev => ({
                ...prev,
                totalTasksCompleted: prev.totalTasksCompleted + 1
              }));
              
              // Update streak
              updateStreak();
              
              // Update activity patterns for intelligent reminders
              updateActivityPatterns(id);
            }
          } else if (newOpenedToday > 0 && task.status === TASK_STATUS.PENDING) {
            newStatus = TASK_STATUS.IN_PROGRESS;
          }
          
          return {
            ...task,
            openedToday: newOpenedToday,
            totalOpened: (task.totalOpened || 0) + 1,
            lastOpened: now,
            status: newStatus
          };
        }
        return task;
      })
    );
  };

  const openTaskPanel = (task = null) => {
    setEditingTask(task);
    setIsPanelOpen(true);
  };

  const closeTaskPanel = () => {
    setIsPanelOpen(false);
    setEditingTask(null);
  };

  const toggleImportExportPanel = () => {
    setIsImportExportOpen(prev => !prev);
  };

  const importTasks = (newTasks) => {
    // Generate new IDs for imported tasks to avoid conflicts
    const tasksWithNewIds = newTasks.map(task => ({
      ...task,
      id: uuidv4(),
      createdAt: task.createdAt || new Date().toISOString(),
      openedToday: 0,
      status: task.status || TASK_STATUS.PENDING,
      priority: task.priority || PRIORITY_LEVELS.MEDIUM
    }));
    
    setTasks(prevTasks => [...prevTasks, ...tasksWithNewIds]);
    toast.success(`Successfully imported ${tasksWithNewIds.length} tasks!`);
  };

  const exportTasks = (format) => {
    return tasks;
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filter by status
      if (filterOptions.status !== 'all' && task.status !== filterOptions.status) {
        return false;
      }
      
      // Filter by priority
      if (filterOptions.priority !== 'all' && task.priority !== filterOptions.priority) {
        return false;
      }
      
      // Filter by category
      if (filterOptions.category && task.category !== filterOptions.category) {
        return false;
      }
      
      // Filter by search term
      if (filterOptions.searchTerm && !task.name.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by selected field
      const direction = filterOptions.sortDirection === 'asc' ? 1 : -1;
      
      switch (filterOptions.sortBy) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'date':
          return direction * (new Date(a.createdAt) - new Date(b.createdAt));
        case 'openCount':
          return direction * (a.totalOpened - b.totalOpened);
        case 'lastOpened':
          if (!a.lastOpened) return direction;
          if (!b.lastOpened) return -direction;
          return direction * (new Date(a.lastOpened) - new Date(b.lastOpened));
        case 'priority':
          const priorityOrder = { [PRIORITY_LEVELS.HIGH]: 0, [PRIORITY_LEVELS.MEDIUM]: 1, [PRIORITY_LEVELS.LOW]: 2 };
          return direction * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        case 'dueDate':
          if (!a.dueDate) return direction;
          if (!b.dueDate) return -direction;
          return direction * (new Date(a.dueDate) - new Date(b.dueDate));
        default:
          return 0;
      }
    });
  };

  const getProgressStats = () => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now);
    const startOfCurrentMonth = startOfMonth(now);
    
    // Initialize stats
    const stats = {
      daily: {
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: tasks.length
      },
      weekly: {
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: 0
      },
      monthly: {
        completed: 0,
        inProgress: 0,
        pending: 0,
        total: 0
      },
      // For chart data
      dailyProgress: Array(7).fill(0),
      priorityDistribution: {
        [PRIORITY_LEVELS.HIGH]: 0,
        [PRIORITY_LEVELS.MEDIUM]: 0,
        [PRIORITY_LEVELS.LOW]: 0
      },
      streak: userStats.currentStreak,
      longestStreak: userStats.longestStreak,
      achievements: userStats.achievements
    };
    
    // Calculate stats
    tasks.forEach(task => {
      // Daily stats
      if (task.status === TASK_STATUS.COMPLETED) {
        stats.daily.completed++;
      } else if (task.status === TASK_STATUS.IN_PROGRESS) {
        stats.daily.inProgress++;
      } else {
        stats.daily.pending++;
      }
      
      // Priority distribution
      stats.priorityDistribution[task.priority || PRIORITY_LEVELS.MEDIUM]++;
      
      // Weekly and monthly stats
      if (task.lastOpened) {
        const lastOpenedDate = new Date(task.lastOpened);
        
        // Weekly stats
        if (lastOpenedDate >= startOfCurrentWeek) {
          stats.weekly.total++;
          if (task.status === TASK_STATUS.COMPLETED) {
            stats.weekly.completed++;
          } else if (task.status === TASK_STATUS.IN_PROGRESS) {
            stats.weekly.inProgress++;
          } else {
            stats.weekly.pending++;
          }
        }
        
        // Monthly stats
        if (lastOpenedDate >= startOfCurrentMonth) {
          stats.monthly.total++;
          if (task.status === TASK_STATUS.COMPLETED) {
            stats.monthly.completed++;
          } else if (task.status === TASK_STATUS.IN_PROGRESS) {
            stats.monthly.inProgress++;
          } else {
            stats.monthly.pending++;
          }
        }
        
        // Daily progress for the last 7 days
        for (let i = 0; i < 7; i++) {
          const dayStart = subDays(now, 6 - i);
          const dayEnd = subDays(now, 5 - i);
          
          if (i === 6) {
            // For today, use current progress
            if (task.openedToday && task.openedToday >= task.dailyGoal) {
              stats.dailyProgress[i]++;
            }
          } else if (
            isWithinInterval(lastOpenedDate, {
              start: dayStart,
              end: dayEnd
            })
          ) {
            stats.dailyProgress[i]++;
          }
        }
      }
    });
    
    return stats;
  };

  const updateReminderPreferences = (preferences) => {
    setUserStats(prev => ({
      ...prev,
      reminderPreferences: {
        ...prev.reminderPreferences,
        ...preferences
      }
    }));
    toast.success('Reminder preferences updated!');
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      confirmDeleteTask,
      cancelDeleteTask,
      incrementTaskOpen,
      isPanelOpen,
      openTaskPanel,
      closeTaskPanel,
      editingTask,
      isImportExportOpen,
      toggleImportExportPanel,
      importTasks,
      exportTasks,
      filterOptions,
      setFilterOptions,
      getFilteredTasks,
      getProgressStats,
      TASK_STATUS,
      PRIORITY_LEVELS,
      userStats,
      updateReminderPreferences,
      isDeleteModalOpen,
      ACHIEVEMENTS,
      taskToDelete
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}