export interface AttendanceRecord {
  date: string;
  startTime: string;
  endTime?: string;
}

export const getCurrentDate = () => new Date().toISOString().split('T')[0];
export const getCurrentTime = () => new Date().toLocaleTimeString();

export const updateAttendanceRecord = (
  records: AttendanceRecord[],
  isClockedIn: boolean
): AttendanceRecord[] => {
  const currentDate = getCurrentDate();
  const currentTime = getCurrentTime();
  
  // Find existing record for today
  const existingRecordIndex = records.findIndex(record => record.date === currentDate);
  
  if (existingRecordIndex === -1) {
    // No record for today exists, create new one
    return [...records, {
      date: currentDate,
      startTime: currentTime,
    }];
  } else {
    // Update existing record
    return records.map((record, index) => {
      if (index === existingRecordIndex) {
        return {
          ...record,
          [isClockedIn ? 'endTime' : 'startTime']: currentTime,
        };
      }
      return record;
    });
  }
};

export const exportToCSV = (records: AttendanceRecord[]): string => {
  const csvContent = ["Date,Start Time,End Time"];
  records.forEach(record => {
    csvContent.push(`${record.date},${record.startTime},${record.endTime || ''}`);
  });
  return csvContent.join('\n');
};

export const importFromCSV = (csvContent: string): AttendanceRecord[] => {
  const lines = csvContent.split('\n');
  lines.shift(); // Remove header
  return lines
    .filter(line => line.trim())
    .map(line => {
      const [date, startTime, endTime] = line.split(',');
      return { date, startTime, endTime: endTime || undefined };
    });
};