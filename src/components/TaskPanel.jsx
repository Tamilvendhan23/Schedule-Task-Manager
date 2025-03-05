import React, { useState, useEffect } from 'react';
import { HiX, HiLink, HiPhotograph, HiCalendar, HiClock, HiTag } from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';

function TaskPanel() {
  const { 
    isPanelOpen, 
    closeTaskPanel, 
    addTask, 
    updateTask, 
    editingTask, 
    TASK_STATUS,
    PRIORITY_LEVELS
  } = useTasks();
  
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    moto: '',
    dailyGoal: 1,
    imagePreview: '',
    status: TASK_STATUS.PENDING,
    priority: PRIORITY_LEVELS.MEDIUM,
    dueDate: '',
    recurring: 'none',
    category: '',
    notes: '',
    reminderTime: ''
  });

  // Reset form when panel opens/closes or editing task changes
  useEffect(() => {
    if (isPanelOpen && editingTask) {
      setFormData({
        name: editingTask.name || '',
        link: editingTask.link || '',
        moto: editingTask.moto || '',
        dailyGoal: editingTask.dailyGoal || 1,
        imagePreview: editingTask.imagePreview || '',
        status: editingTask.status || TASK_STATUS.PENDING,
        priority: editingTask.priority || PRIORITY_LEVELS.MEDIUM,
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '',
        recurring: editingTask.recurring || 'none',
        category: editingTask.category || '',
        notes: editingTask.notes || '',
        reminderTime: editingTask.reminderTime || ''
      });
    } else if (isPanelOpen) {
      setFormData({
        name: '',
        link: '',
        moto: '',
        dailyGoal: 1,
        imagePreview: '',
        status: TASK_STATUS.PENDING,
        priority: PRIORITY_LEVELS.MEDIUM,
        dueDate: '',
        recurring: 'none',
        category: '',
        notes: '',
        reminderTime: ''
      });
    }
  }, [isPanelOpen, editingTask, TASK_STATUS, PRIORITY_LEVELS]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format data for submission
    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };
    
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    
    closeTaskPanel();
  };

  const checkImageUrl = () => {
    if (!formData.link) return;
    
    // Try to extract image from the link
    // This is a simple check - in a real app you might want to use an API
    const url = formData.link;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    // Check if URL ends with an image extension
    const isDirectImage = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    
    if (isDirectImage) {
      setFormData(prev => ({
        ...prev,
        imagePreview: url
      }));
      return;
    }
    
    // For non-direct images, we could use a service like
    // https://www.linkpreview.net/ or similar, but for simplicity
    // we'll just use a placeholder
    setFormData(prev => ({
      ...prev,
      imagePreview: `https://source.unsplash.com/random/800x400?${encodeURIComponent(formData.name)}`
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case PRIORITY_LEVELS.HIGH:
        return 'bg-red-500';
      case PRIORITY_LEVELS.MEDIUM:
        return 'bg-yellow-500';
      case PRIORITY_LEVELS.LOW:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeTaskPanel}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  onClick={closeTaskPanel}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HiX size={24} className="dark:text-white" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Task Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter task name"
                  />
                </div>
                
                <div>
                  <label htmlFor="link" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Website Link
                  </label>
                  <div className="flex">
                    <input
                      type="url"
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      onClick={checkImageUrl}
                      className="bg-gray-100 dark:bg-gray-600 px-3 rounded-r-lg border-y border-r border-gray-300 dark:border-gray-500"
                      title="Check for image preview"
                    >
                      <HiPhotograph className="text-gray-600 dark:text-gray-300" size={20} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="moto" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Task Moto
                  </label>
                  <textarea
                    id="moto"
                    name="moto"
                    value={formData.moto}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Why is this task important?"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dailyGoal" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Daily Goal (times to open)
                    </label>
                    <input
                      type="number"
                      id="dailyGoal"
                      name="dailyGoal"
                      value={formData.dailyGoal}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value={PRIORITY_LEVELS.LOW}>Low</option>
                      <option value={PRIORITY_LEVELS.MEDIUM}>Medium</option>
                      <option value={PRIORITY_LEVELS.HIGH}>High</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Due Date (optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <HiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="recurring" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Recurring
                    </label>
                    <select
                      id="recurring"
                      name="recurring"
                      value={formData.recurring}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Category (optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="e.g., Work, Personal"
                      />
                      <HiTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="reminderTime" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Reminder Time (optional)
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        id="reminderTime"
                        name="reminderTime"
                        value={formData.reminderTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <HiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={TASK_STATUS.PENDING}>Pending</option>
                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Additional notes about this task..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="imagePreview" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Image Preview URL (optional)
                  </label>
                  <input
                    type="url"
                    id="imagePreview"
                    name="imagePreview"
                    value={formData.imagePreview}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  
                  {formData.imagePreview && (
                    <div className="mt-3 rounded-lg overflow-hidden border dark:border-gray-600">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://dummyimage.com/400x200/ccc/000&text=${formData.name}`;
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(formData.priority)} mr-2`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.priority === PRIORITY_LEVELS.HIGH ? 'High Priority' : 
                       formData.priority === PRIORITY_LEVELS.MEDIUM ? 'Medium Priority' : 'Low Priority'}
                    </span>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default TaskPanel;