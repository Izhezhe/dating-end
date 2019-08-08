var SIGN_REGEXP = /([yMdhsm])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding(s, len) {
  var lens = len - (s + '').length
  for (var i = 0; i < lens; i++) { s = '0' + s }
  return s
}

let now = new Date(); //当前日期
let nowDayOfWeek = now.getDay(); //今天本周的第几天
let nowMonth = now.getMonth(); //当前月
let nowYear = now.getYear();
nowYear += (nowYear < 2000) ? 1900 : 0; //

 
let formatDate = {
  format: function(date, pattern) {
    pattern = pattern || DEFAULT_PATTERN
    return pattern.replace(SIGN_REGEXP, function($0) {
      switch ($0.charAt(0)) {
        case 'y': return padding(date.getFullYear(), $0.length)
        case 'M': return padding(date.getMonth() + 1, $0.length)
        case 'd': return padding(date.getDate(), $0.length)
        case 'w': return date.getDay() + 1
        case 'h': return padding(date.getHours(), $0.length)
        case 'm': return padding(date.getMinutes(), $0.length)
        case 's': return padding(date.getSeconds(), $0.length)
      }
    })
  },
  parse: function(dateString, pattern) {
    var matchs1 = pattern.match(SIGN_REGEXP)
    var matchs2 = dateString.match(/(\d)+/g)
    if (matchs1.length === matchs2.length) {
      var _date = new Date(1970, 0, 1)
      for (var i = 0; i < matchs1.length; i++) {
        var _int = parseInt(matchs2[i])
        var sign = matchs1[i]
        switch (sign.charAt(0)) {
          case 'y': _date.setFullYear(_int); break
          case 'M': _date.setMonth(_int - 1); break
          case 'd': _date.setDate(_int); break
          case 'h': _date.setHours(_int); break
          case 'm': _date.setMinutes(_int); break
          case 's': _date.setSeconds(_int); break
        }
      }
      return _date
    }
    return null
  }
}

let getTimeSlot = {
  today: function() {
    return formatDate.format(now, 'yyyy-MM-dd')
  },
  monthFirstDay: function() {
    return formatDate.format(new Date(nowYear, nowMonth, 1), 'yyyy-MM-dd')
  },
  yearFirstDay: function() {
    return formatDate.format(new Date(nowYear, 0, 1), 'yyyy-MM-dd')
  },
  beforeYearLastDay: function() {
    return formatDate.format(new Date((nowYear-1), 11, 31), 'yyyy-MM-dd')
  },
  nowYear: function() {
    return now.getFullYear()
  },
  threeYearsLater: function() {
    return formatDate.format(new Date((nowYear+3), nowMonth, 15), 'yyyy-MM-dd')
  }
}

let randomNum = {
  random: function() {
    return parseInt(Math.random()*5)
  }
}

export default { formatDate, getTimeSlot, randomNum }
