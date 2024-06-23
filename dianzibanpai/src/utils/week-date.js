// 页面初始时获取当前是本年第几周
export function getWeek(endDate) {
  //本年的第一天
  let beginDate = new Date(endDate.getFullYear(), 0, 1)
  //星期从0-6,0代表星期天，6代表星期六
  let endWeek = endDate.getDay()
  if (endWeek == 0) endWeek = 7
  let beginWeek = beginDate.getDay()
  if (beginWeek == 0) beginWeek = 7
  //计算两个日期的天数差
  let millisDiff = endDate.getTime() - beginDate.getTime()
  let dayDiff = Math.floor(
    (millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000
  )
  return Math.ceil(dayDiff / 7) + 1
}
export function getDate() {
  let date = new Date() // 获取时间
  let year = date.getFullYear() // 获取年
  let month = date.getMonth() + 1 // 获取月
  let day = date.getDate() // 获取日
  return `${year}年${month}月${day}日`
}
