import INTERVAL_TYPE from './intervaltype';
import TimeBucket from './timebucket';
import TimeSpan from './timespan';

let intervals = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
let intervalLimit = {
  millisecond: 1000,
  second: 60,
  minute: 60,
  hour: 24,
  month: 12
};

function getLimit(intervalType, date) {
  if (intervalType === 'day') {
    return date.daysInMonth;
  }
  else {
    let limit = intervalLimit[intervalType];
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

export default class Timeously {
  constructor(options, callback) {
    let {name, interval, type, tz, start, stop} = options;

    this.name = (name ? ` ${name}` : '');
    this.interval = interval || 1;
    this.intervalType = type || INTERVAL_TYPE.MINUTELY;
    this.tz = tz;
    this.callback = callback;
    this.startTime = start;
    this.stopTime = stop;
    this.started = false;

    this.timerID = null;
    this.start();
  }

  static get IntervalTypes() {
    return INTERVAL_TYPE;
  }

  static get TimeBucket() {
    return TimeBucket;
  }

  static get TimeSpan() {
    return TimeSpan;
  }

  get title() {
    let {interval, intervalType} = this;

    for (let key in INTERVAL_TYPE) {
      let val = INTERVAL_TYPE[key];

      if (val === intervalType)
        return `${interval} ${key.toLowerCase()}`;
    }
  }

  get now() {
    return new TimeBucket().tz(this.tz);
  }

  execute() {
    let self = this;

    if (!self.timerID) return;

    self.callback();

    let nextTimeoutMillisec = self.calculateNextTimeout();

    //self.timerID = setTimeout(function () {
    //  self.execute();
    //}, nextTimeoutMillisec);
    this.setLongTimeout(nextTimeoutMillisec);
  }

  start() {
    let self = this;
    let {title, name} = self;

    let nextTimeoutMillisec = self.calculateNextTimeout();
    let timespan = new TimeSpan(nextTimeoutMillisec);

    //self.timerID = setTimeout(function () {
    //  self.execute();
    //}, nextTimeoutMillisec);
    this.setLongTimeout(nextTimeoutMillisec);

    console.log(`Timeously starting ${title}${name} in T - ${timespan.toString()} and counting`);
  }

  stop() {
    let {title, name, now} = this;

    console.log(`[${title}]${name}: Called stop at ${now.toString()}`);

    this.started = false;
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  calculateNextTimeout() {
    let {name, title, interval, intervalType, started, now, startTime, stopTime} = this;

    let limit = getLimit(intervalType, now);

    let nextEvent = now;

    // set lower interval types to 0
    for (let i = 6; i >= 0; i--) {
      let interv = intervals[i];
      if (interv === intervalType) break;

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

    // next possible interval
    nextEvent[intervalType]++;
    // current interval value
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
        // get the next interval type event
        while (interval > 1 && nextEvent[intervalType] % interval !== 0) {
          nextEvent[intervalType]++;
        }
      }
      else {
        nextEvent[intervalType] += interval - 1;
      }
    }

    // get the diff in milliseconds between nextEvent and now
    let millisecs = nextEvent - this.now;

    console.log(`[${this.now.toString()}] (${title})${name} - Next event is at ${nextEvent.toString()}. ${millisecs}ms`);

    return millisecs;
  }

  setLongTimeout(timeout_ms) {
    let self = this;
    let {title, name} = self;
    let max = 86400000; // 1 day vs 2147483647 (max int)
    //if we have to wait more than max time, need to recursively call this function again
    if(timeout_ms > max) {
      //now wait until the max wait time passes then call this function again with
      //requested wait - max wait we just did, make sure and pass callback
      self.timerID = setTimeout(function () {
        let remaining = timeout_ms - max;
        let days = Math.floor(remaining / 86400000);
        console.log(`${title}${name}: Long timer - ${days} days remaining`);
        self.setLongTimeout(remaining);
      }, max);
    }
    //if we are asking to wait less than max, finally just do regular seTimeout and call callback
    else {
      setTimeout(function () {
        self.execute();
      }, timeout_ms);
    }
  }

}