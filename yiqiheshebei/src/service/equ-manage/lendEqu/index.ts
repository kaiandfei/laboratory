import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'

// 获取出借列表
export const getLendList = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/equipmentLendList',
    data
  })
}
// 获取未出借设备
export const getEquList1 = (data: any) => {
  return myRequest.post<any>({
    url: '/schooldvc/SchoolEquipmentLend/schoolEquipment',
    data
  })
}
// 新增设备出借登记
export const addEquLend = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/schoolEquipmentAdd',
    data
  })
}
// 删除归还清单
export const delEquLend = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/delReturnList',
    data
  })
}
// 归还设备清单
export const returnEquList = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/returnRegistrationList',
    data
  })
}

// 归还设备
export const returnEquApi = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/returnRegistration',
    data
  })
}
// 归还设备维修
export const returnRepairApi = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/returnMaintenance',
    data
  })
}

// 归还设备报废
export const returnScrapApi = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/returnScrap',
    data
  })
}

// 归还设备损坏赔偿
export const returnDamageApi = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentLend/returnDamage ',
    data
  })
}
