import INTERVAL_TYPE from './intervaltype';
import TimeBucket from './timebucket';

export default class Timeously {
  constructor(options, callback) {
    let {name, interval, type, tz} = options;

    this.name = (name ? ` ${name}` : '');
    this.interval = interval || 1;
    this.intervalType = type || INTERVAL_TYPE.MINUTELY;
    this.tz = tz;
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

  now() {
    return new TimeBucket().tz(this.tz);
  }

  start() {
    let self = this;
    let {title, name, intervalType, interval} = this;
    let eta = 60 - new Date().getSeconds();

    function callback() {
      let now = self.now();

      if (now[intervalType] % interval === 0) {
        self.callback();
      }
    }

    this.initID = setTimeout(() => {
      // set a secondly interval
      this.timerID = setInterval(callback, 1000);

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
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }
}