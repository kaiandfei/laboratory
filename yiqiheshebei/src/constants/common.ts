const NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
export function getWeeks(num: number) {
  const WEEKS: any = []
  let obj = {
    value: 1,
    title: ''
  }
  for (let i = 1; i < num + 1; i++) {
    if (i > 10 && i < 20) {
      obj = {
        value: i,
        title: `第十${NUMS[i - 11]}周`
      }
      WEEKS.push(obj)
    } else if (i === 20) {
      obj = {
        value: i,
        title: `第二十周`
      }
      WEEKS.push(obj)
    } else if (i > 20 && i < 30) {
      obj = {
        value: i,
        title: `第二十${NUMS[i - 21]}周`
      }
      WEEKS.push(obj)
    } else if (i === 30) {
      obj = {
        value: i,
        title: `第三十周`
      }
      WEEKS.push(obj)
    } else if (i > 30 && i < 40) {
      obj = {
        value: i,
        title: `第三十${NUMS[i - 31]}周`
      }
      WEEKS.push(obj)
    } else if (i === 40) {
      obj = {
        value: i,
        title: `第四十周`
      }
      WEEKS.push(obj)
    } else if (i > 40 && i < 50) {
      obj = {
        value: i,
        title: `第四十${NUMS[i - 41]}周`
      }
      WEEKS.push(obj)
    } else if (i === 50) {
      obj = {
        value: i,
        title: `第五十周`
      }
      WEEKS.push(obj)
    } else {
      obj = {
        value: i,
        title: `第${NUMS[i - 1]}周`
      }
      WEEKS.push(obj)
    }
  }
  return WEEKS
}

export const period = [{
  id: 0,
  name: '全部'
}, {
  name: '小学',
  id: 1
}, {
  name: '初中',
  id: 2
}, {
  name: '高中',
  id: 3
},]
