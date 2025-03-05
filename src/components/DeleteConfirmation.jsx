import React from 'react';
import { HiX, HiExclamation, HiTrash } from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';

function DeleteConfirmation() {
  const { isDeleteModalOpen, taskToDelete, deleteTask, cancelDeleteTask } = useTasks();

  return (
    <AnimatePresence>
      {isDeleteModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={cancelDeleteTask}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                    <HiExclamation className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                  <h2 className="text-xl font-bold dark:text-white">Confirm Deletion</h2>
                  <button
                    onClick={cancelDeleteTask}
                    className="ml-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close modal"
                  >
                    <HiX size={20} className="dark:text-white" />
                  </button>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelDeleteTask}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteTask(taskToDelete)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <HiTrash className="mr-2" size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DeleteConfirmation;