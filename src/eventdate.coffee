pad = (num, len) ->
  num = '' + num if typeof num isnt 'string'
  len = 2 if !len

  return num if num.length >= len

  padding = ''

  for i in [0..len - num.length]
    padding += '0'

  padding + num

class EventDate
  constructor: ->
    @date = new Date()

  toString: ->
    min = pad(@minute, 2)
    "#{@dayName} #{@day} #{@monthName} #{@year} @#{@hour}:#{@minute}"

Object.defineProperties EventDate::,
  minute:
    get: -> @date.getMinutes()
    set: (val) -> @date.setMinutes(val)

  hour:
    get: -> @date.getHours()
    set: (val) -> @date.setHours(val)

  day:
    get: -> @date.getDate()
    set: (val) -> @date.setDate(val)

  dayOfWeek:
    get: -> @date.getDay()
    set: (val) -> @date.setDay(val)

  dayName:
    get: -> dayNames[@dayOfWeek]

  month:
    get: -> @date.getMonth()
    set: (val) -> @date.setMonth(val)

  monthName:
    get: -> monthNames[@month]

  year:
    get: -> @date.getFullYear()
    set: (val) -> @date.setFullYear(val)
