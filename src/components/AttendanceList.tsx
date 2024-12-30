import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { AttendanceLog } from '../services/attendanceService';

interface AttendanceListProps {
  records: AttendanceLog[];
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ records }) => {
  // Group logs by date
  const groupedLogs = React.useMemo(() => {
    const groups: { [key: string]: AttendanceLog[] } = {};
    records.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [records]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Attendance Log</h2>
      <div className="bg-gray-800 rounded-lg shadow-xl p-4 max-h-[60vh] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {groupedLogs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-center py-4"
            >
              No attendance records yet
            </motion.p>
          ) : (
            <ul className="space-y-3">
              {groupedLogs.map(([date, logs]) => (
                <motion.li
                  key={date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-700 rounded-lg p-4 shadow-md"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-300">
                      {format(new Date(date), 'EEEE, MMMM do, yyyy')}
                    </span>
                    <div className="flex flex-col gap-2 mt-2">
                      {logs.map((log) => (
                        <div key={log.timestamp} className="flex justify-between items-center">
                          <span className={log.type === 'in' ? 'text-green-400' : 'text-red-400'}>
                            {log.type === 'in' ? 'In' : 'Out'}: {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </span>
                          {log.note && (
                            <span className="text-gray-400 text-sm">{log.note}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};