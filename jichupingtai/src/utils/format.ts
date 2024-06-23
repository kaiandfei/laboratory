type itemType = {
  type: number
  deviceType: string
  labor_id: string|number
}
const arr = ['海康摄像头', '智能门锁', '电子班牌', '学生终端', '定向投射书写板专用灯', '微棱晶防眩读写专用灯', '光环境一体化智能电动窗帘电机', '智能计量红外控制器', '室内环境监测传感器', '空开设备', 'ifid仪器终端', '教师终端']
export const deviceFormat = (data: any,val='') => {
  const res = data.map((item: itemType) => {
    item['deviceType'] = arr[item.type - 1]
    if (item.labor_id===0&&val==='') {
      item.labor_id = '无数据'
    }else if (item.labor_id===0&&val==='set') {
      item.labor_id = ''
    }
    return item
  })
  return res
}
export const onlineListFormat = (item: any) => {
  const obj = {
    title: arr[item.type-1] +'在线率',
    total: item.total,
    rate: item.rate,
    online_total: item.online_total
  }
  return obj
}
