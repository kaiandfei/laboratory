export function getDiffDay(date_1:string, date_2:string) {
  // 计算两个日期之间的差值
  const myDate_1 = Date.parse(date_1)
  const myDate_2 = Date.parse(date_2)
  // 将两个日期都转换为毫秒格式，然后做差
  const diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值

  const totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
  console.log(totalDays)

  return totalDays    // 相差的天数
}
