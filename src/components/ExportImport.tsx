import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { AttendanceRecord, exportToCSV, importFromCSV } from '../utils/attendance';

interface ExportImportProps {
  records: AttendanceRecord[];
  onImport: (records: AttendanceRecord[]) => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ records, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const csvContent = exportToCSV(records);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendance_log.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedRecords = importFromCSV(content);
        onImport(importedRecords);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
      >
        <span>Export Records</span>
      </motion.button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        className="hidden"
      />
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
      >
        <span>Import Records</span>
      </motion.button>
    </motion.div>
  );
};