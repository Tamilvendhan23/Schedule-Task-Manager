import React from 'react';
import { useTasks } from '../context/TaskContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

function TaskStats({ className = '' }) {
  const { getProgressStats, TASK_STATUS } = useTasks();
  const stats = getProgressStats();
  
  // Colors for the charts
  const COLORS = {
    completed: '#10B981', // green-500
    inProgress: '#F59E0B', // yellow-500
    pending: '#EF4444', // red-500
  };
  
  // Prepare data for the pie chart
  const pieData = [
    { name: 'Completed', value: stats.daily.completed, color: COLORS.completed },
    { name: 'In Progress', value: stats.daily.inProgress, color: COLORS.inProgress },
    { name: 'Pending', value: stats.daily.pending, color: COLORS.pending },
  ];
  
  // Prepare data for the daily progress chart
  const dailyProgressData = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, 6 - i);
    dailyProgressData.push({
      name: format(date, 'EEE'),
      completed: stats.dailyProgress[i],
    });
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold mb-6 dark:text-white">Task Progress Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 dark:text-white">Daily</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-500">{stats.daily.completed}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.daily.inProgress}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-red-500">{stats.daily.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 dark:text-white">Weekly</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-500">{stats.weekly.completed}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.weekly.inProgress}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-red-500">{stats.weekly.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2 dark:text-white">Monthly</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-500">{stats.monthly.completed}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.monthly.inProgress}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-red-500">{stats.monthly.pending}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-center dark:text-white">Task Status Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Daily Progress Chart */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-center dark:text-white">Last 7 Days Completed Tasks</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyProgressData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10B981" name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskStats;