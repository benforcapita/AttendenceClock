import { Observable } from '@nativescript/core';
import { AttendanceModel } from './models/attendance';

export class HelloWorldModel extends Observable {
    private attendanceModel: AttendanceModel;

    constructor() {
        super();
        this.attendanceModel = new AttendanceModel();
    }

    get isClockedIn(): boolean {
        return this.attendanceModel.isClockedIn;
    }

    get records() {
        return this.attendanceModel.records;
    }

    get buttonText(): string {
        return this.isClockedIn ? 'Clock Out' : 'Clock In';
    }

    get buttonClass(): string {
        return this.isClockedIn ? 'bg-red-500' : 'bg-green-500';
    }

    onClockTap() {
        this.attendanceModel.toggleClock();
        this.notifyPropertyChange('buttonText', this.buttonText);
        this.notifyPropertyChange('buttonClass', this.buttonClass);
        this.notifyPropertyChange('records', this.records);
    }
}