import pad from './pad';

export default class TimeSpan {

  constructor(millisec) {

    this.millisec = millisec || 0;

    let totalsec = ~~(millisec / 1000);
		// let remainder = millisec % 1000;

    this.days = ~~(totalsec / 86400);
    // After deducting the days calculate the number of hours left
    this.hours = ~~((totalsec - (this.days * 86400)) / 3600);
    // After days and hours , how many minutes are left
    this.mins = ~~((totalsec - (this.days * 86400) - (this.hours * 3600)) / 60);
    // Finally how many seconds left after removing days, hours and minutes.
    this.sec = ~~((totalsec - (this.days * 86400) - (this.hours * 3600) - (this.mins * 60)));// + 1; removing to test exports delta
  }

  get totalDays() {
    return this.days;
  }

  get totalHours() {
    return ~~(this.totalSec / 3600);
  }

  get totalMins() {
    return ~~(this.totalSec / 60);
  }

  get totalSec() {
    return Math.ceil(this.millisec / 1000);
  }

  toString() {
    let clock = '';

    if (this.days > 0)
      clock += `${pad(this.days)}:`;

    clock += `${pad(this.hours)}:${pad(this.mins)}:${pad(this.sec)}`;

    return clock;
  }
}
