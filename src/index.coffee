monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
dayNames = ['mon', 'tues', 'wed', 'thurs', 'fri', 'sat', 'sun']

_INTERVAL_TYPE =
  MINUTELY: 'minute'
  HOURLY: 'hour'
  DAILY: 'day'
  WEEKLY: 'dayOfWeek'
  MONTHLY: 'month'

class Timeously
  constructor: (options, @callback) ->
    @name = if options.name then ' ' + options.name else ''
    @interval = options.interval || 1
    @intervalType = options.type || _INTERVAL_TYPE.MINUTELY
    @modulus = options.start

    @timerID = null
    @initID = null
    @start()

  start: ->
    eta = 60 - new Date().getSeconds()

    callback = =>
      now = new EventDate()

      if (@nextEvent[@intervalType] is now[@intervalType])
        @callback()
        @readyNextEvent()

    init = =>
      # set a minutely interval
      @timerID = setInterval(callback, 60000)
      @readyNextEvent()

      console.log("Timeously firing #{@title}#{@name} from #{@nextEvent.toString()}")

      callback()

    @initID = setTimeout(init, eta * 1000)
    console.log("Timeously starting #{@title}#{@name} in T - #{eta}sec and counting")

  stop: ->
    if (@initID isnt null)
      clearTimeout(@initID)
      @initID = null

    if (@timerID isnt null)
      clearTimeout(@timerID)
      @timerID = null

  readyNextEvent: ->
    @lastEvent = new EventDate()
    @nextEvent = new EventDate()

    lastPeriod = @lastEvent[@intervalType]

    if (@modulus)
      for i in [0...@interval]
        delta = i + 1
        testPeriod = lastPeriod + delta

        if (testPeriod % @modulus is 0)
          @nextEvent[@intervalType] = lastPeriod + delta
          break
    else
      @nextEvent[@intervalType] = lastPeriod + @interval

Object.defineProperty Timeously::, 'title',
  get: ->
    for key, val of _INTERVAL_TYPE
      return "#{@interval} #{key.toLowerCase()}" if val is @intervalType

fn = (options, callback) ->
  new Timeously(options, callback)

fn.IntervalTypes = _INTERVAL_TYPE

if (typeof(define) is 'function' && define.amd)
  define -> fn
else if (typeof(module) isnt 'undefined' && typeof(module.exports) isnt 'undefined')
  module.exports = fn
