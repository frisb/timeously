"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
const pad_1 = require("./pad");
const localOffsetMinutes = -new Date().getTimezoneOffset();
class TimeBucket {
    constructor(date) {
        if (!date) {
            date = new Date();
        }
        else if (typeof (date) === 'string') {
            date = new Date(date);
        }
        this.date = date;
        this.tzOffsetMinutes = -date.getTimezoneOffset();
    }
    static get MonthNames() {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    static get DayNames() {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }
    get offsetString() {
        const tzo = this.tzOffsetMinutes;
        if (tzo === 0) {
            return 'Z';
        }
        else {
            const diff = tzo >= 0 ? '+' : '-';
            return `${diff}${pad_1.pad(Math.floor(Math.abs(tzo / 60)))}:${pad_1.pad(Math.abs(tzo % 60))}`;
        }
    }
    tz(timezone) {
        if (!timezone)
            timezone = 'GMT';
        this.tzOffsetMinutes = moment.tz(timezone).utcOffset();
        this.minute += this.tzOffsetMinutes - localOffsetMinutes;
        return this;
    }
    subtract(timeBucket) {
        return this.valueOf() - timeBucket.valueOf();
    }
    toString(format) {
        if (format) {
            return format
                .replace('yyyy', this.year.toString())
                .replace('yy', this.year.toString().substr(2))
                .replace('MM', pad_1.pad(this.month + 1))
                .replace('dd', pad_1.pad(this.day))
                .replace('HH', pad_1.pad(this.hour))
                .replace('mm', pad_1.pad(this.minute))
                .replace('ss', pad_1.pad(this.second))
                .replace('SSS', pad_1.pad(this.millisecond, 3))
                .replace('Z', this.offsetString);
        }
        else {
            return this.toISOString(true);
        }
    }
    valueOf() {
        return this.date.getTime();
    }
    toUTCDate() {
        const d = new Date(this.date);
        d.setMinutes(d.getMinutes() - this.tzOffsetMinutes + localOffsetMinutes);
        return d;
    }
    toISOString(withTimeZoneOffset = false) {
        if (withTimeZoneOffset) {
            return this.year
                + '-' + pad_1.pad(this.month + 1)
                + '-' + pad_1.pad(this.day)
                + 'T' + pad_1.pad(this.hour)
                + ':' + pad_1.pad(this.minute)
                + ':' + pad_1.pad(this.second)
                + '.' + pad_1.pad(this.millisecond, 3)
                + this.offsetString;
        }
        else {
            return this.toUTCDate().toISOString();
        }
    }
    get millisecond() { return this.date.getMilliseconds(); }
    set millisecond(val) { this.date.setMilliseconds(val); }
    get second() { return this.date.getSeconds(); }
    set second(val) { this.date.setSeconds(val); }
    get minute() { return this.date.getMinutes(); }
    set minute(val) { this.date.setMinutes(val); }
    get hour() { return this.date.getHours(); }
    set hour(val) { this.date.setHours(val); }
    get day() { return this.date.getDate(); }
    set day(val) { this.date.setDate(val); }
    get dayName() {
        return TimeBucket.DayNames[this.dayOfWeek];
    }
    get month() { return this.date.getMonth(); }
    set month(val) { this.date.setMonth(val); }
    get monthName() { return TimeBucket.MonthNames[this.month]; }
    get year() { return this.date.getFullYear(); }
    set year(val) { this.date.setFullYear(val); }
    get daysInMonth() {
        return new Date(this.year, this.month + 1, 0).getDate();
    }
}
exports.TimeBucket = TimeBucket;
//# sourceMappingURL=timebucket.js.map