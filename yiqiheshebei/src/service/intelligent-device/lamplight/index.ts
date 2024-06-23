import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { ListItem } from './types'

// 采购计划列表
export const getLighting = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/peripheral/DeviceController/getLighting',
  })
}
