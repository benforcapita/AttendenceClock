import { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { ClockButton } from './components/ClockButton';
import { AttendanceList } from './components/AttendanceList';
import { Drawer } from './components/Drawer/Drawer';
import { useAttendance } from './hooks/useAttendance';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logs, isClockedIn, toggleClock, importCSV, exportCSV } = useAttendance();

  const handleClockToggle = () => {
    toggleClock();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = importCSV(content);
        if (!success) {
          alert('Failed to import CSV. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const csvContent = exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <MainLayout onOpenDrawer={() => setIsDrawerOpen(true)}>
      <ClockButton 
        isClockedIn={isClockedIn} 
        onToggle={handleClockToggle} 
      />
      <AttendanceList records={logs} />
      <Drawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onImport={handleFileUpload}
        onExport={handleExport}
      />
    </MainLayout>
  );
}