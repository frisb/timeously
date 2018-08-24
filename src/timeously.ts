import { INTERVAL_TYPE } from './intervaltype';
import { TimeBucket } from './timebucket';
import { TimeSpan } from './timespan';

interface IIntervalLimit {
	[key: string]: number;
	millisecond: number;
	second: number;
	minute: number;
	hour: number;
	month: number;
}

const intervals = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
const intervalLimit: IIntervalLimit = {
	millisecond: 1000,
	second: 60,
	minute: 60,
	hour: 24,
	month: 12
};

function getLimit(intervalType: INTERVAL_TYPE, timeBucket: TimeBucket) {
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

function validTime(currTime: number, startTime: number, stopTime: number) {
	if (!startTime || !stopTime)
		return true;

	if (startTime < stopTime)
		return currTime >= startTime && currTime <= stopTime;

	return currTime >= startTime || currTime <= stopTime;
}

export interface ITimeouslyOptions {
	name: string;
	interval: number;
	type: INTERVAL_TYPE;
	tz: string;
	start: number;
	stop: number;
}

export class Timeously {
	private name: string;
	private interval: number;
	private intervalType: INTERVAL_TYPE;
	private tz: string;
	private callback: () => void;
	private startTime: number;
	private stopTime: number;
	private started = false;
	private timerID: NodeJS.Timer = null;

	constructor(options: ITimeouslyOptions, callback: () => void) {
		const { name, interval, type, tz, start, stop } = options;

		this.name = (name ? ` ${ name }` : '');
		this.interval = interval || 1;
		this.intervalType = type || INTERVAL_TYPE.MINUTELY;
		this.tz = tz;
		this.callback = callback;
		this.startTime = start;
		this.stopTime = stop;

		this.start();
	}

	private get title() {
		const { interval, intervalType } = this;

		for (const key in INTERVAL_TYPE) {
		  if (INTERVAL_TYPE.hasOwnProperty(key)) {
			  const val = INTERVAL_TYPE[key];

			  if (val === intervalType)
				  return `${ interval } ${ key.toLowerCase() }`;
		  }
		}
	}

	private get now(): TimeBucket {
		return new TimeBucket().tz(this.tz);
	}

	public start() {
		const { title, name } = this;

		const nextTimeoutMillisec = this.calculateNextTimeout();
		const timespan = new TimeSpan(nextTimeoutMillisec);

//self.timerID = setTimeout(function () {
//  self.execute();
//}, nextTimeoutMillisec);
		this.setLongTimeout(nextTimeoutMillisec);

		console.log(`Timeously starting ${ title }${ name } in T - ${ timespan.toString() } and counting`);
	}

	public stop() {
		const { title, name, now } = this;

		console.log(`[${ title }]${name}: Called stop at ${now.toString()}`);

		this.started = false;
		if (this.timerID !== null) {
			clearTimeout(this.timerID);
			this.timerID = null;
		}
	}

	private execute() {
		if (!this.timerID) return;

		this.callback();

		const nextTimeoutMillisec = this.calculateNextTimeout();

//self.timerID = setTimeout(function () {
//  self.execute();
//}, nextTimeoutMillisec);
		this.setLongTimeout(nextTimeoutMillisec);
	}

	private calculateNextTimeout() {
		const { name, title, interval, intervalType, started, now, startTime, stopTime } = this;
		const limit = getLimit(intervalType, now);
		const nextEvent = now;

// set lower interval types to 0
		for (let i = 6; i >= 0; i--) {
			const interv = intervals[i];
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
		const millisec = nextEvent.valueOf() - this.now.valueOf();

		console.log(`[${ this.now.toString() }] (${ title })${ name } - Next event is at ${ nextEvent.toString() }. ${ millisec }ms`);

		return millisec;
	}

	private setLongTimeout(timeoutMs: number) {
		const { title, name } = this;
		const max = 86400000; // 1 day vs 2147483647 (max int)
//if we have to wait more than max time, need to recursively call this function again
		if (timeoutMs > max) {
//now wait until the max wait time passes then call this function again with
//requested wait - max wait we just did, make sure and pass callback
			this.timerID = setTimeout(() => {
				const remaining = timeoutMs - max;
				const days = Math.floor(remaining / 86400000);
				console.log(`${ title }${ name }: Long timer - ${ days } days remaining`);
				this.setLongTimeout(remaining);
			}, max);
		}
//if we are asking to wait less than max, finally just do regular seTimeout and call callback
		else {
			this.timerID = setTimeout(() => this.execute(), timeoutMs);
		}
	}
}
