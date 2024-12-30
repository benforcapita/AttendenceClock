export interface AttendanceLog {
  timestamp: string;
  type: 'in' | 'out';
  note?: string;
}

export interface DailyAttendance {
  clockIn?: AttendanceLog;
  clockOut?: AttendanceLog;
}

export interface MonthlyAttendance {
  month: string; // YYYY-MM format
  days: { [key: string]: DailyAttendance }; // key is YYYY-MM-DD
  lastReset: string; // ISO date string
}

class AttendanceService {
  private readonly STORAGE_KEY = 'attendance_logs';
  private readonly RESET_DAY = 10;

  private getCurrentMonth(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private shouldReset(lastReset: string): boolean {
    const now = new Date();
    const lastResetDate = new Date(lastReset);
    const currentDay = now.getDate();
    
    return currentDay >= this.RESET_DAY && 
           (lastResetDate.getMonth() !== now.getMonth() || 
            lastResetDate.getFullYear() !== now.getFullYear());
  }

  private getMonthlyAttendance(): MonthlyAttendance {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return {
          month: this.getCurrentMonth(),
          days: {},
          lastReset: new Date().toISOString()
        };
      }
      const parsed = JSON.parse(stored);
      // Ensure the parsed object has the correct structure
      if (!parsed || typeof parsed !== 'object' || !parsed.days) {
        return {
          month: this.getCurrentMonth(),
          days: {},
          lastReset: new Date().toISOString()
        };
      }
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {
        month: this.getCurrentMonth(),
        days: {},
        lastReset: new Date().toISOString()
      };
    }
  }

  private saveMonthlyAttendance(data: MonthlyAttendance): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  addLog(type: 'in' | 'out', note?: string): void {
    let attendance = this.getMonthlyAttendance();
    const currentDate = this.getCurrentDate();
    
    // Check if we need to reset the logs
    if (this.shouldReset(attendance.lastReset)) {
      attendance = {
        month: this.getCurrentMonth(),
        days: {},
        lastReset: new Date().toISOString()
      };
    }

    // Initialize the day if it doesn't exist
    if (!attendance.days[currentDate]) {
      attendance.days[currentDate] = {};
    }

    // Update the appropriate timestamp (in or out)
    const newLog: AttendanceLog = {
      timestamp: new Date().toISOString(),
      type,
      note
    };

    if (type === 'in') {
      attendance.days[currentDate].clockIn = newLog;
    } else {
      attendance.days[currentDate].clockOut = newLog;
    }

    this.saveMonthlyAttendance(attendance);
  }

  getLogs(): AttendanceLog[] {
    const attendance = this.getMonthlyAttendance();
    const logs: AttendanceLog[] = [];

    // Check if days exists and has entries
    if (attendance?.days) {
      Object.entries(attendance.days)
        .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date descending
        .forEach(([_, dayData]) => {
          if (dayData.clockIn) {
            logs.push(dayData.clockIn);
          }
          if (dayData.clockOut) {
            logs.push(dayData.clockOut);
          }
        });
    }

    return logs;
  }

  importFromCSV(csvContent: string): boolean {
    try {
      const rows = csvContent.split('\\n').filter(row => row.trim());
      const attendance: MonthlyAttendance = {
        month: this.getCurrentMonth(),
        days: {},
        lastReset: new Date().toISOString()
      };

      for (let i = 1; i < rows.length; i++) { // Skip header row
        const [timestamp, type, note] = rows[i].split(',').map(cell => cell.trim());
        if (timestamp && (type === 'in' || type === 'out')) {
          const date = timestamp.split('T')[0];
          if (!attendance.days[date]) {
            attendance.days[date] = {};
          }

          const log: AttendanceLog = {
            timestamp,
            type: type as 'in' | 'out',
            note: note || undefined
          };

          if (type === 'in') {
            attendance.days[date].clockIn = log;
          } else {
            attendance.days[date].clockOut = log;
          }
        }
      }

      this.saveMonthlyAttendance(attendance);
      return true;
    } catch (error) {
      console.error('Error importing CSV:', error);
      return false;
    }
  }

  exportToCSV(): string {
    const attendance = this.getMonthlyAttendance();
    const header = 'Timestamp,Type,Note\\n';
    const rows: string[] = [];

    if (attendance?.days) {
      Object.entries(attendance.days)
        .sort((a, b) => a[0].localeCompare(b[0])) // Sort by date ascending
        .forEach(([_, dayData]) => {
          if (dayData.clockIn) {
            rows.push(`${dayData.clockIn.timestamp},${dayData.clockIn.type},${dayData.clockIn.note || ''}`);
          }
          if (dayData.clockOut) {
            rows.push(`${dayData.clockOut.timestamp},${dayData.clockOut.type},${dayData.clockOut.note || ''}`);
          }
        });
    }

    return header + rows.join('\\n');
  }

  getCurrentDayLogs(): DailyAttendance | null {
    const attendance = this.getMonthlyAttendance();
    const currentDate = this.getCurrentDate();
    return attendance?.days?.[currentDate] || null;
  }
}

export const attendanceService = new AttendanceService();
