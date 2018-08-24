"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pad_1 = require("./pad");
class TimeSpan {
    constructor(millisec = 0) {
        this.millisec = millisec;
        const sec = millisec / 1000;
        this.days = ~~(sec / 86400);
        this.hours = ~~((sec - (this.days * 86400)) / 3600);
        this.mins = ~~((sec - (this.days * 86400) - (this.hours * 3600)) / 60);
        this.sec = ~~((sec - (this.days * 86400) - (this.hours * 3600) - (this.mins * 60))) + 1;
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
        const { days, hours, mins, sec } = this;
        let clock = '';
        if (days > 0)
            clock += `${pad_1.pad(days)}:`;
        clock += `${pad_1.pad(hours)}:${pad_1.pad(mins)}:${pad_1.pad(sec)}`;
        return clock;
    }
}
exports.TimeSpan = TimeSpan;
//# sourceMappingURL=timespan.js.map