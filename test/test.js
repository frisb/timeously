'use strict';
var assert = require('assert');
var Timeously = require('../lib/timeously');
var TimeBucket = Timeously.TimeBucket;

describe('Timeously', function () {
	this.timeout(3600000); // 1 hour

	//it('timebucket - test set minute only changes the minute', function (done) {
	//	var a = new TimeBucket();
	//	console.log(a.toString());
	//	a.minute = 5;
	//	console.log(a.toString());
	//	done();
	//});
	//
	//it('timebucket - test increment changes time', function (done) {
	//	var a = new TimeBucket(new Date(2015,1,1,23,55,0));
	//	console.log(a.toString());
	//	a.minute += 5;
	//	console.log(a.toString());
	//	done();
	//});
	//
	it('should start a timeout', function (done) {

		var options = {
			name: 'my event',
			type: Timeously.IntervalTypes.SECONDLY,
			interval: 1//,
			//start: 10,
			//stop: 45,
			//tz: 'Asia/Kolkata'
		};

		var i = 0;

		var t = new Timeously(options, function () {
			console.log(`Executed event ${i + 1} at ${t.now.toString()}`);

			if (i === 12) {
				console.log('Limit reached');
				t.stop();
				done();
			}

			i++
		});

	});

	//it('should test dark time', function (done) {
	//	var options = {
	//		name: 'dark time',
	//		type: Timeously.IntervalTypes.SECONDLY,
	//		interval: 5,
	//		start: 45,
	//		stop: 5,
	//		tz: 'Asia/Kolkata'
	//	};
	//
	//	let i = 0;
	//
	//	var t = new Timeously(options, function () {
	//		if (i === 2) {
	//			done();
	//			return;
	//		}
	//
	//		let now = t.now;
	//
	//		if (options.start < options.stop) {
	//			assert(now.second >= options.start && now.second <= options.stop);
	//		}
	//		else {
	//			assert(now.second >= options.start || now.second <= options.stop);
	//		}
	//
	//		if (now.second === options.start) {
	//			i++;
	//		}
	//
	//	});
	//
	//});

});