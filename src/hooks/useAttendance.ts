import { useState, useEffect } from 'react';
import { attendanceService, AttendanceLog } from '../services/attendanceService';

export function useAttendance() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isClockedIn, setIsClockedIn] = useState(false);

  const updateState = () => {
    const allLogs = attendanceService.getLogs();
    setLogs(allLogs);

    // Check current day's status
    const currentDayLogs = attendanceService.getCurrentDayLogs();
    if (currentDayLogs) {
      // If there's a clock-out after the last clock-in, we're clocked out
      if (currentDayLogs.clockOut && currentDayLogs.clockIn) {
        const clockInTime = new Date(currentDayLogs.clockIn.timestamp).getTime();
        const clockOutTime = new Date(currentDayLogs.clockOut.timestamp).getTime();
        setIsClockedIn(clockInTime > clockOutTime);
      } else {
        // If there's only a clock-in, we're clocked in
        setIsClockedIn(!!currentDayLogs.clockIn);
      }
    } else {
      setIsClockedIn(false);
    }
  };

  useEffect(() => {
    updateState();
  }, []);

  const toggleClock = (note?: string) => {
    const type = isClockedIn ? 'out' : 'in';
    attendanceService.addLog(type, note);
    updateState();
  };

  const importCSV = (csvContent: string): boolean => {
    const success = attendanceService.importFromCSV(csvContent);
    if (success) {
      updateState();
    }
    return success;
  };

  const exportCSV = (): string => {
    return attendanceService.exportToCSV();
  };

  return {
    logs,
    isClockedIn,
    toggleClock,
    importCSV,
    exportCSV
  };
}