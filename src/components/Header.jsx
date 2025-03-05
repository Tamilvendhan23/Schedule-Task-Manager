import React, { useState } from 'react';
import { HiMenu, HiPlus, HiMoon, HiSun, HiChartBar, HiUpload, HiBell } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext'; 

function Header() {
  const { isDark, setIsDark } = useTheme();
  const { openTaskPanel, toggleImportExportPanel, userStats } = useTasks(); 
  
  return (
    <header className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md z-50 transition-colors duration-300">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">  
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TamilTasker
            </h1>
            
            {userStats.currentStreak > 0 && (
              <div className="ml-4 hidden md:flex items-center bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-sm">
                <span className="mr-1">🔥</span> {userStats.currentStreak} day streak
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <HiSun className="text-yellow-500" size={24} /> : <HiMoon size={24} />}
            </button>
            
            {/* optional we can add notification but now i removed the code*/}
            
            <button
              onClick={toggleImportExportPanel}
              className="hidden md:flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
              title="Import/Export Tasks"
            >
              <HiUpload size={20} /> Import/Export
            </button>
            
            <button 
              onClick={() => openTaskPanel()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiPlus size={20} /> Add Task
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;