# Timeously [![Build Status](https://travis-ci.org/frisb/timeously.png)](http://travis-ci.org/frisb/timeously)

[![npm status badge](https://nodei.co/npm/timeously.png?stars=true&downloads=true)](https://nodei.co/npm/timeously/)

Timeously is a scheduler that fires events at precise predefined intervals.

All contributions are welcome.

## Simple API

#### Timeously(options, callback)

* `options` Object
  * `name` String. Name.
  * `type` PeriodType. The type of interval.
  * `interval` Number Optional. The number of interval periods between each event callback. Defaults to 1.
  * `start` Number Optional. The starting point of the interval, the modulo of the Interval periods and the start must equal 0. Defaults to 1.
* `callback` Function. The callback has argument `(response)`, a Dynect JSON [Response](Response.md)

Returns a Timeously instance.

#### Timeously.PeriodTypes

* `MINUTELY`
* `HOURLY`
* `DAILY`
* `WEEKLY`
* `MONTHLY`

#### instance.start()

Starts the scheduler.

#### instance.stop()

Stops the scheduler.

## Example Usage

``` js
var Timeously = require('timeously');

var options = {
  name: 'my event',
  type: Timeously.IntervalTypes.MINUTELY,
  interval: 5
  start: 5
};

var i = 0;

var t = Timeously(options, function () {
  if (i === 2) {
    console.log('stopping after 10 minutes.');
    t.stop();
  }
  else {
    console.log('this is my psuedo event');
  }

  i++
});

```

## Installation

```
npm install timeously
```

## License

(The MIT License)

Copyright (c) frisB.com &lt;play@frisb.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![Analytics](https://ga-beacon.appspot.com/UA-40562957-5/timeously/readme)](https://github.com/igrigorik/ga-beacon)
