import * as moment from 'moment-timezone';
import { pad } from './pad';
import { INTERVAL_TYPE } from './intervaltype';

const localOffsetMinutes = -new Date().getTimezoneOffset();

export class TimeBucket {
	[intervalType: string]: any;

	public tzOffsetMinutes: number;
	public date: Date;

	constructor(date?: Date | string) {
		if (!date) {
			date = new Date();
		}
		else if (typeof(date) === 'string') {
			date = new Date(date);
		}

		this.date = date;
		this.tzOffsetMinutes = -date.getTimezoneOffset();
	}

	public static get MonthNames() {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	}

	public static get DayNames() {
		return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	}

	public get offsetString() {
		const tzo = this.tzOffsetMinutes;

		if (tzo === 0) {
			return 'Z';
		}
		else {
			const diff = tzo >= 0 ? '+' : '-';
			return `${diff}${pad(Math.floor(Math.abs(tzo / 60)))}:${pad(Math.abs(tzo % 60))}`;
		}
	}

	public tz(timezone: string) {
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
	public subtract(timeBucket: TimeBucket) {
		return this.valueOf() - timeBucket.valueOf();
	}

	public toString(format?: string) {
		if (format) {
			return format
				.replace('yyyy', this.year.toString())
				.replace('yy', this.year.toString().substr(2))
				.replace('MM', pad(this.month + 1))
				.replace('dd', pad(this.day))
				.replace('HH', pad(this.hour))
				.replace('mm', pad(this.minute))
				.replace('ss', pad(this.second))
				.replace('SSS', pad(this.millisecond, 3))
				.replace('Z', this.offsetString);
		}
		else {
			return this.toISOString(true);
		}
	}

	public valueOf() {
		return this.date.getTime();
	}

	public toUTCDate() {
		const d = new Date(this.date);
		d.setMinutes(d.getMinutes() - this.tzOffsetMinutes + localOffsetMinutes);
		return d;
	}

	public toISOString(withTimeZoneOffset = false) {
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

	public get millisecond() { return this.date.getMilliseconds(); }
	public set millisecond(val) { this.date.setMilliseconds(val); }

	public get second() { return this.date.getSeconds(); }
	public set second(val) { this.date.setSeconds(val); }

	public get minute() { return this.date.getMinutes(); }
	public set minute(val) { this.date.setMinutes(val); }

	public get hour() { return this.date.getHours(); }
	public set hour(val) { this.date.setHours(val); }

	public get day() { return this.date.getDate(); }
	public set day(val) { this.date.setDate(val); }

	public get dayOfWeek() { return this.date.getDay(); }

	public get dayName() {
		return TimeBucket.DayNames[this.dayOfWeek];
	}

	public get month() { return this.date.getMonth(); }
	public set month(val) { this.date.setMonth(val); }

	public get monthName() { return TimeBucket.MonthNames[this.month]; }

	public get year() { return this.date.getFullYear(); }
	public set year(val) { this.date.setFullYear(val); }

	public get daysInMonth() {
		return new Date(this.year, this.month + 1, 0).getDate();
	}
}
