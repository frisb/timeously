'use strict';
var assert = require('assert');
var Timeously = require('../lib/timeously');

describe('Timeously', function () {
	this.timeout(120000);

	it('should start a timeout', function (done) {
		var options = {
			name: 'my event',
			type: Timeously.IntervalTypes.SECONDLY,
			interval: 5,
			tz: 'Asia/Manila'
		};

		var i = 0;

		var t = new Timeously(options, function () {
			console.log(i + 1, t.now().toString());
			if (i === 2) {
				console.log('stopping after 10 seconds.');
				t.stop();

				done();
			}
			else {
				console.log('this is my psuedo event ' + i);
			}

			i++
		});

	});
});