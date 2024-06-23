import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { ListItem } from './types'

// 获取空气开关
export const getAirSwitch = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/getAirSwitch',
  })
}

// 保存设置
export const saveAirSwitchSetting = (data:any) => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/saveAirSwitchSetting',
    data
  })
}

// 获取设置
export const findAirSwitchSetting = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/findAirSwitchSetting',
  })
}
