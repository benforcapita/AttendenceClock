import { Observable } from '@nativescript/core';

export interface AttendanceRecord {
    date: string;
    startTime: string;
    endTime?: string;
}

export class AttendanceModel extends Observable {
    private _records: AttendanceRecord[] = [];
    private _isClockedIn: boolean = false;
    private _startTime: Date | null = null;

    get records(): AttendanceRecord[] {
        return this._records;
    }

    get isClockedIn(): boolean {
        return this._isClockedIn;
    }

    toggleClock() {
        const currentDate = new Date().toISOString().split('T')[0];
        
        if (!this._isClockedIn) {
            this._isClockedIn = true;
            this._startTime = new Date();
            const existingRecord = this._records.find(r => r.date === currentDate);
            
            if (existingRecord) {
                existingRecord.startTime = this._startTime.toLocaleTimeString();
            } else {
                this._records.push({
                    date: currentDate,
                    startTime: this._startTime.toLocaleTimeString()
                });
            }
        } else {
            this._isClockedIn = false;
            const endTime = new Date();
            const existingRecord = this._records.find(r => r.date === currentDate);
            
            if (existingRecord) {
                existingRecord.endTime = endTime.toLocaleTimeString();
            }
        }

        this.notifyPropertyChange('records', this._records);
        this.notifyPropertyChange('isClockedIn', this._isClockedIn);
    }

    exportToCSV(): string {
        let csvContent = "Date,Start Time,End Time\n";
        this._records.forEach(record => {
            csvContent += `${record.date},${record.startTime},${record.endTime || ''}\n`;
        });
        return csvContent;
    }

    importFromCSV(csvContent: string) {
        const lines = csvContent.split('\n');
        lines.shift(); // Remove header
        
        this._records = lines
            .filter(line => line.trim())
            .map(line => {
                const [date, startTime, endTime] = line.split(',');
                return { date, startTime, endTime };
            });

        this.notifyPropertyChange('records', this._records);
    }
}