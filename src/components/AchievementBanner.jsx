import React from 'react';
import { FaTrophy, FaFire, FaStar, FaMedal, FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';

function AchievementBanner({ streak, achievements }) {
  const { ACHIEVEMENTS } = useTasks();
  
  // Find the next achievement to unlock
  const getNextAchievement = () => {
    // Check for streak achievements
    const streakAchievements = ACHIEVEMENTS.filter(a => a.id.startsWith('streak-'))
      .sort((a, b) => a.threshold - b.threshold);
    
    for (const achievement of streakAchievements) {
      if (!achievements.includes(achievement.id) && streak < achievement.threshold) {
        return {
          ...achievement,
          progress: streak / achievement.threshold
        };
      }
    }
    
    // If all streak achievements are unlocked, return the highest one
    return {
      ...streakAchievements[streakAchievements.length - 1],
      progress: 1
    };
  };
  
  const nextAchievement = getNextAchievement();
  
  // Get the appropriate icon for an achievement
  const getAchievementIcon = (id) => {
    if (id.startsWith('streak-')) return <FaFire className="text-orange-500" />;
    if (id.startsWith('tasks-')) return <FaStar className="text-yellow-500" />;
    if (id === 'perfect-week') return <FaCalendarCheck className="text-green-500" />;
    return <FaTrophy className="text-yellow-500" />;
  };
  
  // Get the most recent achievements (up to 3)
  const recentAchievements = achievements.length > 0
    ? ACHIEVEMENTS.filter(a => achievements.includes(a.id)).slice(-3)
    : [];
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 mb-8 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <FaFire className="text-orange-300 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {streak} Day Streak!
            </h3>
            <p className="text-blue-100">
              Keep it up! You're making great progress.
            </p>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="flex justify-between text-sm mb-1">
            <span>Next achievement: {nextAchievement.name}</span>
            <span>{Math.round(nextAchievement.progress * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <motion.div 
              className="h-2.5 rounded-full bg-yellow-300"
              style={{ width: `${nextAchievement.progress * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${nextAchievement.progress * 100}%` }}
              transition={{ duration: 1 }}
            ></motion.div>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {nextAchievement.description}
          </p>
        </div>
        
        {recentAchievements.length > 0 && (
          <div className="flex space-x-2 mt-4 md:mt-0">
            {recentAchievements.map(achievement => (
              <motion.div 
                key={achievement.id}
                className="bg-white/10 p-2 rounded-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                title={achievement.description}
              >
                <span className="mr-2">{getAchievementIcon(achievement.id)}</span>
                <span className="text-sm">{achievement.name}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AchievementBanner;