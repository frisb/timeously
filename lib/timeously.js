/*! timeously v0.2.1 (Mon, 18 Apr 2016 06:05:52)

Timeous interval creation for precise milestone events
@module timeously
@author Ashley Brener <ashley@frisb.com>
@license MIT

The MIT License (MIT)

Copyright (c) 2016 frisB.com <play@frisb.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("moment-timezone"));
	else if(typeof define === 'function' && define.amd)
		define("Timeously", ["moment-timezone"], factory);
	else if(typeof exports === 'object')
		exports["Timeously"] = factory(require("moment-timezone"));
	else
		root["Timeously"] = factory(root["moment-timezone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_24__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(1);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(2);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _intervaltype = __webpack_require__(21);
	
	var _intervaltype2 = _interopRequireDefault(_intervaltype);
	
	var _timebucket = __webpack_require__(22);
	
	var _timebucket2 = _interopRequireDefault(_timebucket);
	
	var _timespan = __webpack_require__(25);
	
	var _timespan2 = _interopRequireDefault(_timespan);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var intervals = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
	var intervalLimit = {
	  millisecond: 1000,
	  second: 60,
	  minute: 60,
	  hour: 24,
	  month: 11
	};
	
	function getLimit(intervalType, date) {
	  var limit = intervalLimit[intervalType];
	  if (!limit) {
	    if (intervalType === 'day') {
	      return date.daysInMonth;
	    } else {
	      throw new Error('Can not currently handle ' + intervalType + ' intervals');
	    }
	  }
	
	  return limit;
	}
	
	var Timeously = function () {
	  function Timeously(options, callback) {
	    (0, _classCallCheck3.default)(this, Timeously);
	    var name = options.name;
	    var interval = options.interval;
	    var type = options.type;
	    var tz = options.tz;
	    var start = options.start;
	    var stop = options.stop;
	
	
	    this.name = name ? ' ' + name : '';
	    this.interval = interval || 1;
	    this.intervalType = type || _intervaltype2.default.MINUTELY;
	    this.tz = tz;
	    this.callback = callback;
	    this.startTime = start;
	    this.stopTime = stop;
	    this.started = false;
	
	    this.timerID = null;
	    this.start();
	  }
	
	  (0, _createClass3.default)(Timeously, [{
	    key: 'execute',
	    value: function execute() {
	      var self = this;
	
	      if (!self.timerID) return;
	
	      self.callback();
	
	      var nextTimeoutMillisec = self.calculateNextTimeout();
	
	      self.timerID = setTimeout(function () {
	        self.execute();
	      }, nextTimeoutMillisec);
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var self = this;
	      var title = self.title;
	      var name = self.name;
	
	
	      var nextTimeoutMillisec = self.calculateNextTimeout();
	      var timespan = new _timespan2.default(nextTimeoutMillisec);
	
	      self.timerID = setTimeout(function () {
	        self.execute();
	      }, nextTimeoutMillisec);
	
	      console.log('Timeously starting ' + title + name + ' in T - ' + timespan.toString() + ' and counting');
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      var title = this.title;
	      var name = this.name;
	      var now = this.now;
	
	
	      console.log('[' + title + ']' + name + ': Called stop at ' + now.toString());
	
	      this.started = false;
	      if (this.timerID !== null) {
	        clearTimeout(this.timerID);
	        this.timerID = null;
	      }
	    }
	  }, {
	    key: 'calculateNextTimeout',
	    value: function calculateNextTimeout() {
	      var name = this.name;
	      var title = this.title;
	      var interval = this.interval;
	      var intervalType = this.intervalType;
	      var started = this.started;
	      var now = this.now;
	      var startTime = this.startTime;
	      var stopTime = this.stopTime;
	
	
	      var limit = getLimit(intervalType, now);
	
	      var nextEvent = now;
	
	      // set lower interval types to 0
	      for (var i = 6; i >= 0; i--) {
	        var interv = intervals[i];
	        if (interv === intervalType) break;
	        nextEvent[interv] -= nextEvent[interv];
	      }
	
	      nextEvent[intervalType]++;
	
	      var currTime = nextEvent[intervalType];
	
	      if (startTime) {
	        if (!started) {
	          this.started = true;
	          nextEvent[intervalType] += currTime > startTime ? limit - currTime + startTime : startTime - currTime;
	        } else {
	          nextEvent[intervalType] += interval - 1;
	
	          if (stopTime) {
	            currTime = nextEvent[intervalType];
	
	            var validTime = false;
	            if (startTime < stopTime) {
	              validTime = currTime >= startTime && currTime <= stopTime;
	            } else {
	              validTime = currTime >= startTime || currTime <= stopTime;
	            }
	
	            if (!validTime) {
	              nextEvent[intervalType] += currTime > startTime ? limit - currTime + startTime : startTime - currTime;
	            }
	          }
	        }
	      } else {
	        if (!started) {
	          this.started = true;
	          // get the next interval type event
	          while (interval > 1 && nextEvent[intervalType] % interval !== 0) {
	            nextEvent[intervalType]++;
	          }
	        } else {
	          nextEvent[intervalType] += interval - 1;
	        }
	      }
	
	      console.log('[' + this.now.toString() + '] (' + title + ')' + name + ' - Next event is at ' + nextEvent.toString() + '.');
	
	      // get the diff in milliseconds between nextEvent and now
	      return nextEvent - this.now;
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      var interval = this.interval;
	      var intervalType = this.intervalType;
	
	
	      for (var key in _intervaltype2.default) {
	        var val = _intervaltype2.default[key];
	
	        if (val === intervalType) return interval + ' ' + key.toLowerCase();
	      }
	
	      return;
	    }
	  }, {
	    key: 'now',
	    get: function get() {
	      return new _timebucket2.default().tz(this.tz);
	    }
	  }], [{
	    key: 'IntervalTypes',
	    get: function get() {
	      return _intervaltype2.default;
	    }
	  }, {
	    key: 'TimeBucket',
	    get: function get() {
	      return _timebucket2.default;
	    }
	  }, {
	    key: 'TimeSpan',
	    get: function get() {
	      return _timespan2.default;
	    }
	  }]);
	  return Timeously;
	}();

	exports.default = Timeously;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(3);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	var $Object = __webpack_require__(8).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(16), 'Object', {defineProperty: __webpack_require__(12).f});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(7)
	  , core      = __webpack_require__(8)
	  , ctx       = __webpack_require__(9)
	  , hide      = __webpack_require__(11)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 7 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.2.2'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(12)
	  , createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(16) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(13)
	  , IE8_DOM_DEFINE = __webpack_require__(15)
	  , toPrimitive    = __webpack_require__(19)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function(){
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14)
	  , document = __webpack_require__(7).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		SECONDLY: 'second',
		MINUTELY: 'minute',
		HOURLY: 'hour',
		DAILY: 'day',
		WEEKLY: 'dayOfWeek',
		MONTHLY: 'month'
	};
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _classCallCheck2 = __webpack_require__(1);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(2);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _pad = __webpack_require__(23);
	
	var _pad2 = _interopRequireDefault(_pad);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var moment = __webpack_require__(24);
	
	var localOffsetMinutes = -new Date().getTimezoneOffset();
	
	var TimeBucket = function () {
		function TimeBucket(date) {
			(0, _classCallCheck3.default)(this, TimeBucket);
	
			if (!date) {
				date = new Date();
			} else if (typeof date === 'string') {
				date = new Date(date);
			} else {
				date = date;
			}
	
			this.date = date;
			this._tzOffsetMinutes = -date.getTimezoneOffset();
		}
	
		(0, _createClass3.default)(TimeBucket, [{
			key: 'tz',
			value: function tz(timezone) {
				if (!timezone) timezone = 'GMT';
	
				this.tzOffsetMinutes = moment.tz(timezone).utcOffset();
				this.minute += this.tzOffsetMinutes - localOffsetMinutes;
				return this;
			}
	
			/**
	   * returns the different in milliseconds between this and timeBucket date
	   * @param timeBucket
	   * @returns {number}
	    */
	
		}, {
			key: 'subtract',
			value: function subtract(timeBucket) {
				return this - timeBucket;
			}
		}, {
			key: 'toString',
			value: function toString(format) {
				if (format) {
					return format.replace('yyyy', this.year.toString()).replace('yy', this.year.toString().substr(2)).replace('MM', (0, _pad2.default)(this.month + 1)).replace('dd', (0, _pad2.default)(this.day)).replace('HH', (0, _pad2.default)(this.hour)).replace('mm', (0, _pad2.default)(this.minute)).replace('ss', (0, _pad2.default)(this.second)).replace('SSS', (0, _pad2.default)(this.millisecond, 3)).replace('ZZZ', this.offsetString);
				} else {
					return this.toISOString(true);
				}
			}
		}, {
			key: 'valueOf',
			value: function valueOf() {
				return this.date.getTime();
			}
		}, {
			key: 'toUTCDate',
			value: function toUTCDate() {
				var d = new Date(this.date);
				d.setMinutes(d.getMinutes() - this.tzOffsetMinutes + localOffsetMinutes);
				return d;
			}
		}, {
			key: 'toISOString',
			value: function toISOString(withTimeZoneOffset) {
				if (withTimeZoneOffset) {
					return this.year + '-' + (0, _pad2.default)(this.month + 1) + '-' + (0, _pad2.default)(this.day) + 'T' + (0, _pad2.default)(this.hour) + ':' + (0, _pad2.default)(this.minute) + ':' + (0, _pad2.default)(this.second) + '.' + (0, _pad2.default)(this.millisecond, 3) + this.offsetString;
				} else {
					return this.toUTCDate().toISOString();
				}
			}
		}, {
			key: 'offsetString',
			get: function get() {
				var tzo = this.tzOffsetMinutes;
	
				if (tzo === 0) {
					return 'Z';
				} else {
					var diff = tzo >= 0 ? '+' : '-';
					return '' + diff + (0, _pad2.default)(Math.floor(Math.abs(tzo / 60))) + ':' + (0, _pad2.default)(Math.abs(tzo % 60));
				}
			}
		}, {
			key: 'millisecond',
			get: function get() {
				return this.date.getMilliseconds();
			},
			set: function set(val) {
				this.date.setMilliseconds(val);
			}
		}, {
			key: 'second',
			get: function get() {
				return this.date.getSeconds();
			},
			set: function set(val) {
				this.date.setSeconds(val);
			}
		}, {
			key: 'minute',
			get: function get() {
				return this.date.getMinutes();
			},
			set: function set(val) {
				this.date.setMinutes(val);
			}
		}, {
			key: 'hour',
			get: function get() {
				return this.date.getHours();
			},
			set: function set(val) {
				this.date.setHours(val);
			}
		}, {
			key: 'day',
			get: function get() {
				return this.date.getDate();
			},
			set: function set(val) {
				this.date.setDate(val);
			}
		}, {
			key: 'dayOfWeek',
			get: function get() {
				return this.date.getDay();
			},
			set: function set(val) {
				this.date.setDay(val);
			}
		}, {
			key: 'dayName',
			get: function get() {
				return TimeBucket.DayNames[this.dayOfWeek];
			}
		}, {
			key: 'month',
			get: function get() {
				return this.date.getMonth();
			},
			set: function set(val) {
				this.date.setMonth(val);
			}
		}, {
			key: 'monthName',
			get: function get() {
				return TimeBucket.MonthNames[this.month];
			}
		}, {
			key: 'year',
			get: function get() {
				return this.date.getFullYear();
			},
			set: function set(val) {
				this.date.setFullYear(val);
			}
		}, {
			key: 'tzOffsetMinutes',
			get: function get() {
				return this._tzOffsetMinutes;
			},
			set: function set(val) {
				this._tzOffsetMinutes = val;
			}
		}, {
			key: 'daysInMonth',
			get: function get() {
				return new Date(this.year, this.month + 1, 0).getDate();
			}
		}], [{
			key: 'MonthNames',
			get: function get() {
				return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			}
		}, {
			key: 'DayNames',
			get: function get() {
				return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			}
		}]);
		return TimeBucket;
	}();

	exports.default = TimeBucket;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = pad;
	function pad(num, size) {
		if (typeof num !== 'string') num = '' + num;
	
		if (!size) size = 2;
	
		if (num.length === size) return num;
	
		var s = '000000000' + num;
		return s.substr(s.length - size);
	}
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_24__;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _classCallCheck2 = __webpack_require__(1);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(2);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _pad = __webpack_require__(23);
	
	var _pad2 = _interopRequireDefault(_pad);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var TimeSpan = function () {
	  function TimeSpan(millisec) {
	    (0, _classCallCheck3.default)(this, TimeSpan);
	
	
	    this.millisec = millisec || 0;
	
	    var sec = millisec / 1000;
	
	    this.days = ~ ~(sec / 86400);
	    // After deducting the days calculate the number of hours left
	    this.hours = ~ ~((sec - this.days * 86400) / 3600);
	    // After days and hours , how many minutes are left
	    this.mins = ~ ~((sec - this.days * 86400 - this.hours * 3600) / 60);
	    // Finally how many seconds left after removing days, hours and minutes.
	    this.sec = ~ ~(sec - this.days * 86400 - this.hours * 3600 - this.mins * 60) + 1;
	    // Set total sec
	    this.totalSec = ~ ~sec + 1;
	  }
	
	  (0, _createClass3.default)(TimeSpan, [{
	    key: 'toString',
	    value: function toString() {
	      var timer = '';
	
	      if (this.days > 0) timer += (0, _pad2.default)(this.days) + ':';
	
	      timer += (0, _pad2.default)(this.hours) + ':';
	      timer += (0, _pad2.default)(this.mins) + ':' + (0, _pad2.default)(this.sec);
	
	      return timer;
	    }
	  }, {
	    key: 'totalDays',
	    get: function get() {
	      return this.days;
	    }
	  }, {
	    key: 'totalHours',
	    get: function get() {
	      return ~ ~(this.totalsec / 3600);
	    }
	  }, {
	    key: 'totalMins',
	    get: function get() {
	      return ~ ~(this.totalsec / 60);
	    }
	  }]);
	  return TimeSpan;
	}();

	exports.default = TimeSpan;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=timeously.js.map