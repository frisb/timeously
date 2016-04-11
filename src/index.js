import INTERVAL_TYPE from './intervaltype';
import TimeBucket from './timebucket';
import TimeSpan from './timespan';

let intervals = ['year','month','day','hour','minute','second','millisecond'];

export default class Timeously {
  constructor(options, callback) {
    let {name, interval, type, tz} = options;

    this.name = (name ? ` ${name}` : '');
    this.interval = interval || 1;
    this.intervalType = type || INTERVAL_TYPE.MINUTELY;
    this.tz = tz;
    this.callback = callback;

    this.timerID = null;
    this.start();
  }

  static get IntervalTypes() {
    return INTERVAL_TYPE;
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
    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  calculateNextTimeout() {
    let {name, title, interval, intervalType, now} = this;

    let nextEvent = now;

    // set lower interval types to 0
    for (let i = 6; i >= 0; i--) {
      let interv = intervals[i];
      if (interv === intervalType) break;
      nextEvent[interv] -= nextEvent[interv];
    }

    // get the next interval type event
    nextEvent[intervalType]++;
    while (nextEvent[intervalType] % interval !== 0) {
      nextEvent[intervalType]++;
    }

    console.log(`[${title}]${name} - Next event is at ${nextEvent.toString()}`);

    // get the diff in milliseconds between nextEvent and now
    return nextEvent.subtract(this.now);
  }

}