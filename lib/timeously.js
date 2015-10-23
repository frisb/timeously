var EventDate, dayNames, monthNames, pad;

pad = function(num, len) {
  var i, padding, _i, _ref;
  if (typeof num !== 'string') {
    num = '' + num;
  }
  if (!len) {
    len = 2;
  }
  if (num.length >= len) {
    return num;
  }
  padding = '';
  for (i = _i = 0, _ref = len - num.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    padding += '0';
  }
  return padding + num;
};

EventDate = (function() {
  function EventDate() {
    this.date = new Date();
  }

  EventDate.prototype.toString = function() {
    var min;
    min = pad(this.minute, 2);
    return "" + this.dayName + " " + this.day + " " + this.monthName + " " + this.year + " @" + this.hour + ":" + this.minute;
  };

  return EventDate;

})();

Object.defineProperties(EventDate.prototype, {
  minute: {
    get: function() {
      return this.date.getMinutes();
    },
    set: function(val) {
      return this.date.setMinutes(val);
    }
  },
  hour: {
    get: function() {
      return this.date.getHours();
    },
    set: function(val) {
      return this.date.setHours(val);
    }
  },
  day: {
    get: function() {
      return this.date.getDate();
    },
    set: function(val) {
      return this.date.setDate(val);
    }
  },
  dayOfWeek: {
    get: function() {
      return this.date.getDay();
    },
    set: function(val) {
      return this.date.setDay(val);
    }
  },
  dayName: {
    get: function() {
      return dayNames[this.dayOfWeek];
    }
  },
  month: {
    get: function() {
      return this.date.getMonth();
    },
    set: function(val) {
      return this.date.setMonth(val);
    }
  },
  monthName: {
    get: function() {
      return monthNames[this.month];
    }
  },
  year: {
    get: function() {
      return this.date.getFullYear();
    },
    set: function(val) {
      return this.date.setFullYear(val);
    }
  }
});

monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

dayNames = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      factory();
    });
  } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  }
})(function() {
  var Timeously, fn, _INTERVAL_TYPE;
  _INTERVAL_TYPE = {
    MINUTELY: 'minute',
    HOURLY: 'hour',
    DAILY: 'day',
    WEEKLY: 'dayOfWeek',
    MONTHLY: 'month'
  };
  Timeously = (function() {
    function Timeously(options, callback) {
      this.callback = callback;
      this.name = options.name ? ' ' + options.name : '';
      this.interval = options.interval || 1;
      this.intervalType = options.type || _INTERVAL_TYPE.MINUTELY;
      this.modulus = options.start;
      this.timerID = null;
      this.initID = null;
      this.start();
    }

    Timeously.prototype.start = function() {
      var callback, eta, init;
      eta = 60 - new Date().getSeconds();
      callback = (function(_this) {
        return function() {
          var now;
          now = new EventDate();
          if (_this.nextEvent[_this.intervalType] === now[_this.intervalType]) {
            _this.callback();
            return _this.readyNextEvent();
          }
        };
      })(this);
      init = (function(_this) {
        return function() {
          _this.timerID = setInterval(callback, 60000);
          _this.readyNextEvent();
          console.log("Timeously firing " + _this.title + _this.name + " from " + (_this.nextEvent.toString()));
          return callback();
        };
      })(this);
      this.initID = setTimeout(init, eta * 1000);
      return console.log("Timeously starting " + this.title + this.name + " in T - " + eta + "sec and counting");
    };

    Timeously.prototype.stop = function() {
      if (this.initID !== null) {
        clearTimeout(this.initID);
        this.initID = null;
      }
      if (this.timerID !== null) {
        clearTimeout(this.timerID);
        return this.timerID = null;
      }
    };

    Timeously.prototype.readyNextEvent = function() {
      var delta, i, lastPeriod, testPeriod, _i, _ref, _results;
      this.lastEvent = new EventDate();
      this.nextEvent = new EventDate();
      lastPeriod = this.lastEvent[this.intervalType];
      if (this.modulus) {
        _results = [];
        for (i = _i = 0, _ref = this.interval; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          delta = i + 1;
          testPeriod = lastPeriod + delta;
          if (testPeriod % this.modulus === 0) {
            this.nextEvent[this.intervalType] = lastPeriod + delta;
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        return this.nextEvent[this.intervalType] = lastPeriod + this.interval;
      }
    };

    return Timeously;

  })();
  Object.defineProperty(Timeously.prototype, 'title', {
    get: function() {
      var key, val;
      for (key in _INTERVAL_TYPE) {
        val = _INTERVAL_TYPE[key];
        if (val === this.intervalType) {
          return "" + this.interval + " " + (key.toLowerCase());
        }
      }
    }
  });
  fn = function(options, callback) {
    return new Timeously(options, callback);
  };
  fn.IntervalTypes = _INTERVAL_TYPE;
  return fn;
});
