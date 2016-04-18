import INTERVAL_TYPE from './intervaltype';
import TimeBucket from './timebucket';
import TimeSpan from './timespan';

let intervals = ['year','month','day','hour','minute','second','millisecond'];
let intervalLimit = {
  millisecond: 1000,
  second: 60,
  minute: 60,
  hour: 24,
  month: 11
};

function getLimit(intervalType, date) {
  let limit = intervalLimit[intervalType];
  if (!limit) {
    if (intervalType === 'day') {
      return date.daysInMonth;
    }
    else {
      throw new Error(`Can not currently handle ${intervalType} intervals`);
    }
  }

  return limit;
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

    return;
  }

  get now() {
    return new TimeBucket().tz(this.tz);
  }

  execute() {
    let self = this;

    if (!self.timerID) return;

    self.callback();

    let nextTimeoutMillisec = self.calculateNextTimeout();

    self.timerID = setTimeout(function() {
      self.execute();
    }, nextTimeoutMillisec);
  }

  start() {
    let self = this;
    let {title, name} = self;

    let nextTimeoutMillisec = self.calculateNextTimeout();
    let timespan = new TimeSpan(nextTimeoutMillisec);

    self.timerID = setTimeout(function() {
      self.execute();
    }, nextTimeoutMillisec);

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
      nextEvent[interv] -= nextEvent[interv];
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

          let validTime = false;
          if (startTime < stopTime) {
            validTime = currTime >= startTime && currTime <= stopTime;
          }
          else {
            validTime = currTime >= startTime || currTime <= stopTime;
          }

          if (!validTime) {
            nextEvent[intervalType] += currTime > startTime ? limit - currTime + startTime : startTime - currTime;
          }
        }
      }
    }
    else {
      if (!started) {
        this.started = true;
        // get the next interval type event
        console.log(name, title, nextEvent[intervalType], interval);
        while (interval > 1 && nextEvent[intervalType] % interval !== 0) {
          nextEvent[intervalType]++;
        }
      }
      else {
        nextEvent[intervalType] += interval - 1;
      }
    }

    console.log(`[${this.now.toString()}] (${title})${name} - Next event is at ${nextEvent.toString()}.`);

    // get the diff in milliseconds between nextEvent and now
    return nextEvent - this.now;
  }

}