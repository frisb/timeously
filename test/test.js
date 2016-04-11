'use strict';
var assert = require('assert');
var Timeously = require('../lib/timeously');

describe('Timeously', function () {
	this.timeout(3600000); // 1 hour

	it('should start a timeout', function (done) {
		var options = {
			name: 'my event',
			type: Timeously.IntervalTypes.MINUTELY,
			interval: 5,
			tz: 'Asia/Manila'
		};

		var i = 0;

		var t = new Timeously(options, function () {
			console.log(`Executed event ${i + 1} at ${t.now.toString()}`);

			if (i === 300) {
				console.log('stopping after 1000 seconds.');
				t.stop();

				done();
			}

			i++
		});

	});
});