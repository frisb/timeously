import INTERVAL_TYPE from './intervaltype';
import TimeBucket from './timebucket';

export default class Timeously {
  constructor(options, callback) {
    let {name, interval, type, start} = options;

    this.name = (name ? ` ${name}` : '');
    this.interval = interval || 1;
    this.intervalType = type || INTERVAL_TYPE.MINUTELY;
    this.modulus = start;
    this.callback = callback;

    this.timerID = null;
    this.initID = null;
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

  start() {
    let self = this;
    let {title, name, intervalType} = this;
    let eta = 60 - new Date().getSeconds();

    function callback() {
      let now = new TimeBucket();

      if (self.nextEvent[intervalType] === now[intervalType]) {
        self.callback();
        self.readyNextEvent();
      }
    }

    this.initID = setTimeout(() => {
      // set a secondly interval
      this.timerID = setInterval(callback, 1000);
      this.readyNextEvent();

      console.log(`Timeously firing ${title}${name} from ${this.nextEvent.toString()}`);

      callback();
    }, eta * 1000);

    console.log(`Timeously starting ${title}${name} in T - ${eta}sec and counting`);
  }

  stop() {
    if (this.initID !== null) {
      clearTimeout(this.initID);
      this.initID = null;
    }

    if (this.timerID !== null) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  readyNextEvent() {
    let {interval, intervalType, modulus} = this;

    this.lastEvent = new TimeBucket();
    this.nextEvent = new TimeBucket();

    let lastPeriod = this.lastEvent[intervalType];

    if (modulus) {
      for (let i = 0; i < interval; i++) {
        let delta = i + 1;
        let testPeriod = lastPeriod + delta;

        if (testPeriod % modulus === 0) {
          this.nextEvent[intervalType] = lastPeriod + delta;
          break;
        }
      }
    }
    else {
      this.nextEvent[intervalType] = lastPeriod + interval;
    }
  }
}