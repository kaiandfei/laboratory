type groupListType = {
  label: string
  id: number
}
export const GROUPLIST: groupListType[] = []
for (let index = 1; index < 22; index++) {
  const obj = {
    label: '',
    id: 1,
  }
  obj['label'] = `分组${index}`
  obj['id'] = index
  GROUPLIST.push(obj)
}


export const DEVICEATTRS = [{
  key: '环境温度',
}, {
  key: '二氧化碳',
}, {
  key: '湿度',
}, {
  key: 'PM10',
}, {
  key: 'PM2.5',
}, {
  key: '挥发性有机物',
},]

export const ROLENAMEOPTION = [
  {
    label: '全部',
    id: null
  },
  {
    label: '教师',
    id: 4
  },
  {
    label: '备课组长',
    id: 3
  },
  {
    label: '学校管理员',
    id: 1
  },
  {
    label: '实验室管理员',
    id: 2
  },
  {
    label: '实验室总管理员',
    id: 5
  }
]
