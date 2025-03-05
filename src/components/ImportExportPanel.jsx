import React, { useState, useCallback } from 'react';
import { HiX, HiDownload, HiUpload } from 'react-icons/hi';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

function ImportExportPanel() {
  const { isImportExportOpen, toggleImportExportPanel, importTasks, exportTasks } = useTasks();
  const [importErrors, setImportErrors] = useState([]);
  
  const onDrop = useCallback(acceptedFiles => {
    setImportErrors([]);
    const file = acceptedFiles[0];
    if (!file) return;
    
    const fileReader = new FileReader();
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.json')) {
      fileReader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (Array.isArray(jsonData)) {
            importTasks(jsonData);
          } else {
            setImportErrors(['Invalid JSON format. Expected an array of tasks.']);
          }
        } catch (error) {
          setImportErrors([`Error parsing JSON: ${error.message}`]);
        }
      };
      fileReader.readAsText(file);
    } 
    else if (fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setImportErrors(results.errors.map(err => `CSV Error: ${err.message}`));
            return;
          }
          
          const tasks = results.data.map(row => ({
            name: row.name || '',
            link: row.link || '',
            moto: row.moto || '',
            dailyGoal: parseInt(row.dailyGoal) || 1,
            imagePreview: row.imagePreview || null,
            status: row.status || 'pending'
          }));
          
          importTasks(tasks);
        }
      });
    } 
    else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      fileReader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const tasks = jsonData.map(row => ({
            name: row.name || '',
            link: row.link || '',
            moto: row.moto || '',
            dailyGoal: parseInt(row.dailyGoal) || 1,
            imagePreview: row.imagePreview || null,
            status: row.status || 'pending'
          }));
          
          importTasks(tasks);
        } catch (error) {
          setImportErrors([`Error parsing Excel file: ${error.message}`]);
        }
      };
      fileReader.readAsArrayBuffer(file);
    } 
    else {
      setImportErrors(['Unsupported file format. Please use JSON, CSV, or Excel files.']);
    }
  }, [importTasks]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });
  
  const handleExport = (format) => {
    const tasks = exportTasks();
    
    if (format === 'json') {
      const jsonString = JSON.stringify(tasks, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      downloadFile(blob, 'tasks.json');
    } 
    else if (format === 'csv') {
      const csv = Papa.unparse(tasks);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      downloadFile(blob, 'tasks.csv');
    } 
    else if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(tasks);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      downloadFile(blob, 'tasks.xlsx');
    }
  };
  
  const downloadFile = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isImportExportOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleImportExportPanel}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto rounded-t-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Import & Export Tasks
                </h2>
                <button
                  onClick={toggleImportExportPanel}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HiX size={24} className="dark:text-white" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Import Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">Import Tasks</h3>
                  
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <HiUpload className="mx-auto text-blue-500" size={36} />
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      {isDragActive
                        ? 'Drop the file here...'
                        : 'Drag & drop a file here, or click to select a file'}
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Supported formats: JSON, CSV, Excel
                    </p>
                  </div>
                  
                  {importErrors.length > 0 && (
                    <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
                      <p className="font-semibold">Import Errors:</p>
                      <ul className="list-disc pl-5 mt-1">
                        {importErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Export Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">Export Tasks</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <HiDownload size={20} /> Export as JSON
                    </button>
                    
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <HiDownload size={20} /> Export as CSV
                    </button>
                    
                    <button
                      onClick={() => handleExport('xlsx')}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <HiDownload size={20} /> Export as Excel
                    </button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg">
                    <p className="text-sm">
                      <strong>Tip:</strong> Exported files can be edited in any spreadsheet software and re-imported to update multiple tasks at once.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ImportExportPanel;