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
			start: 5
		};

		var i = 0;

		var t = new Timeously(options, function () {
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


		// db.star_0('carriers', 'gateways').then(function(carriers, gateways) {
		// 	assert.notEqual(carriers, 'undefined');
		// 	assert.notEqual(gateways, 'undefined');
		// 	done();
		// }).catch(function (err) {
		// 	console.log(err.stack);
		// 	done();
		// });
	});
});