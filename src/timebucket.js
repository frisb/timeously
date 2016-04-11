import pad from './pad';

let moment = require('moment-timezone');

let localOffsetMinutes = -new Date().getTimezoneOffset();

export default class TimeBucket {
	constructor(date) {
		if (!date) {
			date = new Date();
		}
		else if (typeof(date) === 'string') {
			date = new Date(date);
		}
		else {
			date = date;
		}

		this.date = date;
		this._tzOffsetMinutes = -date.getTimezoneOffset();
	}

	static get MonthNames() {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	}

	static get DayNames() {
		return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	}

	get offsetString() {
		let tzo = this.tzOffsetMinutes;

		if (tzo === 0) {
			return 'Z';
		}
		else {
			let diff = tzo >= 0 ? '+' : '-';
			return `${diff}${pad(Math.abs(tzo / 60))}:${pad(Math.abs(tzo % 60))}`;
		}
	}

	tz(timezone) {
		if (!timezone)
			timezone = 'GMT';

		this.tzOffsetMinutes = moment.tz(timezone).utcOffset();
		this.minute += this.tzOffsetMinutes - localOffsetMinutes;
		return this;
	}

	/**
	 * returns the different in milliseconds between this and timeBucket date
	 * @param timeBucket
	 * @returns {number}
   */
	subtract(timeBucket) {
		return this - timeBucket;
	}

	toString(format) {
		if (format) {
			return format.replace('yyyy', this.year.toString())
										.replace('yy', this.year.toString().substr(2))
										.replace('MM', pad(this.month+1))
										.replace('dd', pad(this.day))
										.replace('HH', pad(this.hour))
										.replace('mm', pad(this.minute))
										.replace('ss', pad(this.second))
										.replace('SSS', pad(this.millisecond,3))
										.replace('ZZZ', this.offsetString);
		}
		else {
			return this.toISOString(true);
		}
	}

	valueOf() {
		return this.date.getTime();
	}

	toUTCDate() {
		let d = new Date(this.date);
		d.setMinutes(d.getMinutes() - this.tzOffsetMinutes + localOffsetMinutes);
		return d;
	}

	toISOString(withTimeZoneOffset) {
		if (withTimeZoneOffset) {
				return this.year
					+ '-' + pad(this.month + 1)
					+ '-' + pad(this.day)
					+ 'T' + pad(this.hour)
					+ ':' + pad(this.minute)
					+ ':' + pad(this.second)
					+ '.' + pad(this.millisecond, 3)
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

	get dayOfWeek() { return this.date.getDay(); }
	set dayOfWeek(val) { this.date.setDay(val); }

	get dayName() { return TimeBucket.DayNames[this.dayOfWeek]; }

	get month() { return this.date.getMonth(); }
	set month(val) { this.date.setMonth(val); }

	get monthName() { return TimeBucket.MonthNames[this.month]; }

	get year() { return this.date.getFullYear(); }
	set year(val) { this.date.setFullYear(val); }

	get tzOffsetMinutes() { return this._tzOffsetMinutes; }
	set tzOffsetMinutes(val) { this._tzOffsetMinutes = val; }
}