import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { ListItem } from './types'

// 空气检测
export const getAirSensor = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/getAirSensor',
  })
}

// 空气检测设置
export const findAirSensorSetting = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/findAirSensorSetting',
  })
}

// 空气检测设置保存
export const saveAirSensorSetting = (data: any) => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/saveAirSensorSetting',
    data
  })
}
