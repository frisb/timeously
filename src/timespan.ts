import { pad } from './pad';

export class TimeSpan {
  public days: number;
  public hours: number;
  public mins: number;
  public sec: number;

  constructor(public millisec: number = 0) {
    const sec = millisec / 1000;

    this.days = ~~(sec / 86400);
    // After deducting the days calculate the number of hours left
    this.hours = ~~((sec - (this.days * 86400)) / 3600);
    // After days and hours , how many minutes are left
    this.mins = ~~((sec - (this.days * 86400) - (this.hours * 3600)) / 60);
    // Finally how many seconds left after removing days, hours and minutes.
    this.sec = ~~((sec - (this.days * 86400) - (this.hours * 3600) - (this.mins * 60)));
  }

  public get totalDays() {
    return this.days;
  }

  public get totalHours() {
    return ~~(this.totalSec / 3600);
  }

  public get totalMins() {
    return ~~(this.totalSec / 60);
  }

  public get totalSec() {
    return Math.ceil(this.millisec / 1000);
  }

  public toString(): string {
    const { days, hours, mins, sec } = this;
    let clock = '';

    if (days > 0)
      clock += `${ pad(days) }:`;

    clock += `${ pad(hours) }:${ pad(mins) }:${ pad(sec) }`;

    return clock;
  }
}
