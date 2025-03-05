import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import TaskGrid from './components/TaskGrid';
import Footer from './components/Footer';
import TaskPanel from './components/TaskPanel';
import ImportExportPanel from './components/ImportExportPanel';
import DeleteConfirmation from './components/DeleteConfirmation';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
          <Header />
          <main className="container mx-auto px-4 py-20">
            <TaskGrid />
          </main>
          <TaskPanel />
          <ImportExportPanel />  
                  
           <DeleteConfirmation />
         
 
          <Footer />
            <ToastContainer 
            position="bottom-right" 
            theme="colored" 
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;