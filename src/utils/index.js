import { Raw, Plain, Html } from 'slate'
import Cookie from 'js-cookie'
import moment from 'moment'
import cookie from '../assets/js/cookie'
const qs = require('qs')

function _showTips ({ type, msg, time }) {
  const { dispatch } = XDGlobal._store
  dispatch({
    type: 'app/showTips',
    payload: {
      cvdTipsType: type, // 0,1,2,3  warn,success,info,error
      cvdTipsContent: msg, // 提示内容
      cvdTipsShow: true,
      time,
    },
  })
}
function _showLoading (isLoading) {
  const { dispatch } = XDGlobal._store
  dispatch({
    type: 'app/setState',
    payload: {
      isLoading,
    },
  })
}

export const message = {
  warn (msg, time = 3000) {
    _showTips({ type: 0, msg, time })
  },
  success (msg, time = 3000) {
    _showTips({ type: 1, msg, time })
  },
  info (msg, time = 3000) {
    _showTips({ type: 2, msg, time })
  },
  error (msg, time = 3000) {
    _showTips({ type: 3, msg, time })
  },
}
export const loading = {
  show () {
    _showLoading(true)
  },
  hide () {
    _showLoading(false)
  },
}


export function array2map (arr = [], key = 'id') {
  let res = {}
  arr.forEach((item) => {
    res[item[key]] = item
  })
  return res
}


// 获取url里面的查询参数，返回一个对象
export function getUrlQuery (url) {
  let result = {}
  // url = url.replace('??', '?')
  if (url) {
    url = url.split('?')[1]
    if (url) {
      url = url.split('#')[0]
      let queryArr = url.split('&')
      for (let queryStr of queryArr) {
        let keyAndValueArr = queryStr.split('=')
        result[keyAndValueArr[0]] = decodeURIComponent(keyAndValueArr[1])
      }
    }
  }
  return result
}

export function urlAccountCheck () {
  let url = window.location.href
  if (url.indexOf('??') !== -1) {
    window.location.href = url.replace('??', '?')
    return true
  }
  let queryObj = getUrlQuery(url)
  let lastLoginAccount = Cookie.get('lastCookie')
  if (!queryObj.account && lastLoginAccount) {
    window.location.href = `${window.location.href + (window.location.href.indexOf('?') === -1 ? '?' : '&')}account=${lastLoginAccount}`
    return true
  }
}

// 获取co域名
export function getCoDomain () {
  return window.location.host.indexOf('cvd.xiaoduo') === -1 ? 'co-test.xiaoduoai.com' : 'co.xiaoduoai.com'
}
// generator function 中的 delay
export function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
// 判断是否是PC客户端
export function isPCAgent () {
  return window.navigator.userAgent.indexOf('CVD_PC') !== -1 || window.navigator.userAgent.indexOf('cvd_pc') !== -1
}

/** 日期相关*/
export const TIME_CONST = {
  todayStart: moment().hour(0).minute(0).second(0).millisecond(0),
  yesterdayStart: moment().hour(-24).minute(0).second(0).millisecond(0),
  tomorrowStart: moment().hour(+24).minute(0).second(0).millisecond(0),
  weekStart: moment().hour(-24 * 7).minute(0).second(0).millisecond(0),
  monthStart: moment().hour(-24 * 30).minute(0).second(0).millisecond(0),
  hourSecOffset: 60 * 60,
  daySecOffset: 60 * 60 * 24,
}

TIME_CONST.todayStartSec = TIME_CONST.todayStart.toDate().getTime() / 1000
TIME_CONST.yesterdayStartSec = TIME_CONST.yesterdayStart.toDate().getTime() / 1000
TIME_CONST.weekStartSec = TIME_CONST.weekStart.toDate().getTime() / 1000
TIME_CONST.tomorrowStartSec = TIME_CONST.tomorrowStart.toDate().getTime() / 1000
TIME_CONST.monthStartSec = TIME_CONST.monthStart.toDate().getTime() / 1000

let query = qs.parse(location.search.split('?')[1])
const { account } = query
const uid = Number(cookie.get(`${account}__XD_CVD_UID`))
const ticket = cookie.get(`${account}__XD_CVD_TICKET`)
const unit_id = Number(cookie.get(`${account}__XD_CVD_UNIT_ID`))

export const auth = {
  uid,
  ticket,
  unit_id,
}
export const user = {
  account,
}

export function timeDesc ({ startDate, endDate }) {
// startDate  endDate need  instanceof moment
  let diff = startDate.diff(endDate),
    inOneDay = diff < 0 && diff >= -(TIME_CONST.daySecOffset * 1000)

  // 对昨天和今天(包括后续的特定内容) 显示对应日子
  let startSec = +startDate / 1000,
    endSec = +endDate / 1000,
    startFromToday = startSec - TIME_CONST.todayStartSec >= 0 && startSec - TIME_CONST.todayStartSec < TIME_CONST.daySecOffset,
    startFromYesterday = !startFromToday && TIME_CONST.yesterdayStartSec - startSec <= 0 && startSec - TIME_CONST.yesterdayStartSec < TIME_CONST.daySecOffset,
    endAtToday = endSec - TIME_CONST.tomorrowStartSec < 0 && endSec - TIME_CONST.todayStartSec > 0,
    endAtYesterday = !endAtToday && endSec - TIME_CONST.todayStartSec < 0 && endSec - TIME_CONST.yesterdayStartSec > 0

  if (inOneDay) {
    if (startFromToday) {
      return '今天'
    } else if (startFromYesterday) {
      return '昨天'
    }

    return `${startDate.format('YYYY.MM.DD')}`
  }

  let startDesc = startFromYesterday ? '昨天' : startFromToday ? '今天' : `${startDate.format('YYYY.MM.DD')}`
  let endDesc = endAtToday ? '今天' : endAtYesterday ? '昨天' : `${endDate.format('YYYY.MM.DD')}`

  return `${startDesc} ~ ${endDesc}`
}

export function getMiddleDay(day1, day2) {
 var getDate = function(str) {
       var tempDate = new Date();
       var list = str.split("-");
       tempDate.setFullYear(list[0]);
       tempDate.setMonth(list[1] - 1);
       tempDate.setDate(list[2]);
       return tempDate;
   }
   var date1 = getDate(day1);
   var date2 = getDate(day2);
   if (date1 > date2) {
       var tempDate = date1;
       date1 = date2;
       date2 = tempDate;
   }
   date1.setDate(date1.getDate() + 1);
   var dateArr = [];
   var i = 0;
   while (!(date1.getFullYear() == date2.getFullYear()
           && date1.getMonth() == date2.getMonth() && date1.getDate() == date2
           .getDate())) {
        var dayStr =date1.getDate().toString();
           if(dayStr.length ==1){
               dayStr="0"+dayStr;
           }
       dateArr[i] = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-"
               + dayStr;
       i++;
       date1.setDate(date1.getDate() + 1);
   }
    dateArr.splice(0,0,day1)
    dateArr.push(day2);
   return dateArr;
}
let randomColors = [
  '#00CBCB',
  '#F8D54C',
  '#4FE96A',
  '#F5A55E',
  '#9EEB2C',
  '#AAE5FF',
  '#76B5FF',
  '#7683FF',
  '#9E68F9',
  '#C65AF7',
  '#F496FF',
  '#EE4ED5',
  '#FF7695',
  '#D92C37',
  '#E4454F',
  '#CB2A93',
  '#5060F6',
  '#4C428B',
  '#715177',
  '#35BB11',
]
export function getRandomColor (index, needLight) {
  if (index !== undefined && randomColors[index]) {
    return randomColors[index]
  }
  let random1 = parseInt(Math.random() * (needLight ? 200 : 255), 10)
  let random2 = parseInt(Math.random() * (needLight ? 200 : 255), 10)
  let random3 = parseInt(Math.random() * (needLight ? 200 : 255), 10)
  let color = `rgb(${random1},${random2},${random3})`
  randomColors.push(color)
  return color
}
