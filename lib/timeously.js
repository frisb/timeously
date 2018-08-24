"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intervaltype_1 = require("./intervaltype");
const timebucket_1 = require("./timebucket");
const timespan_1 = require("./timespan");
const intervals = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
const intervalLimit = {
    millisecond: 1000,
    second: 60,
    minute: 60,
    hour: 24,
    month: 12
};
function getLimit(intervalType, timeBucket) {
    if (intervalType === 'day') {
        return timeBucket.daysInMonth;
    }
    else {
        const limit = intervalLimit[intervalType];
        if (!limit) {
            throw new Error(`Can not currently handle ${intervalType} intervals`);
        }
        return limit;
    }
}
function validTime(currTime, startTime, stopTime) {
    if (!startTime || !stopTime)
        return true;
    if (startTime < stopTime)
        return currTime >= startTime && currTime <= stopTime;
    return currTime >= startTime || currTime <= stopTime;
}
class Timeously {
    constructor(options, callback) {
        this.started = false;
        this.timerID = null;
        const { name, interval, type, tz, start, stop } = options;
        this.name = (name ? ` ${name}` : '');
        this.interval = interval || 1;
        this.intervalType = type || intervaltype_1.INTERVAL_TYPE.MINUTELY;
        this.tz = tz;
        this.callback = callback;
        this.startTime = start;
        this.stopTime = stop;
        this.start();
    }
    get title() {
        const { interval, intervalType } = this;
        for (const key in intervaltype_1.INTERVAL_TYPE) {
            if (intervaltype_1.INTERVAL_TYPE.hasOwnProperty(key)) {
                const val = intervaltype_1.INTERVAL_TYPE[key];
                if (val === intervalType)
                    return `${interval} ${key.toLowerCase()}`;
            }
        }
    }
    get now() {
        return new timebucket_1.TimeBucket().tz(this.tz);
    }
    start() {
        const { title, name } = this;
        const nextTimeoutMillisec = this.calculateNextTimeout();
        const timespan = new timespan_1.TimeSpan(nextTimeoutMillisec);
        this.setLongTimeout(nextTimeoutMillisec);
        console.log(`Timeously starting ${title}${name} in T - ${timespan.toString()} and counting`);
    }
    stop() {
        const { title, name, now } = this;
        console.log(`[${title}]${name}: Called stop at ${now.toString()}`);
        this.started = false;
        if (this.timerID !== null) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }
    }
    execute() {
        if (!this.timerID)
            return;
        this.callback();
        const nextTimeoutMillisec = this.calculateNextTimeout();
        this.setLongTimeout(nextTimeoutMillisec);
    }
    calculateNextTimeout() {
        const { name, title, interval, intervalType, started, now, startTime, stopTime } = this;
        const limit = getLimit(intervalType, now);
        const nextEvent = now;
        for (let i = 6; i >= 0; i--) {
            const interv = intervals[i];
            if (interv === intervalType)
                break;
            switch (interv) {
                case 'day':
                    nextEvent[interv] = 1;
                    break;
                case 'month':
                    nextEvent[interv] = 0;
                    break;
                default:
                    nextEvent[interv] -= nextEvent[interv];
                    break;
            }
        }
        nextEvent[intervalType]++;
        let currTime = nextEvent[intervalType];
        if (startTime) {
            if (!started) {
                this.started = true;
                nextEvent[intervalType] += currTime > startTime ? limit - currTime + startTime : startTime - currTime;
            }
            else {
                nextEvent[intervalType] += interval - 1;
                if (stopTime) {
                    currTime = nextEvent[intervalType];
                    if (!validTime(currTime, startTime, stopTime)) {
                        nextEvent[intervalType] += currTime > startTime ? limit - currTime + startTime : startTime - currTime;
                    }
                }
            }
        }
        else {
            if (!started) {
                this.started = true;
                while (interval > 1 && nextEvent[intervalType] % interval !== 0) {
                    nextEvent[intervalType]++;
                }
            }
            else {
                nextEvent[intervalType] += interval - 1;
            }
        }
        const millisec = nextEvent.valueOf() - this.now.valueOf();
        console.log(`[${this.now.toString()}] (${title})${name} - Next event is at ${nextEvent.toString()}. ${millisec}ms`);
        return millisec;
    }
    setLongTimeout(timeoutMs) {
        const { title, name } = this;
        const max = 86400000;
        if (timeoutMs > max) {
            this.timerID = setTimeout(() => {
                const remaining = timeoutMs - max;
                const days = Math.floor(remaining / 86400000);
                console.log(`${title}${name}: Long timer - ${days} days remaining`);
                this.setLongTimeout(remaining);
            }, max);
        }
        else {
            this.timerID = setTimeout(() => this.execute(), timeoutMs);
        }
    }
}
exports.Timeously = Timeously;
//# sourceMappingURL=timeously.js.map