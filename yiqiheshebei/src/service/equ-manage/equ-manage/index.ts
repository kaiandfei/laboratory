import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { equList, allotList, WarehousingList, checkList, RequestDataLabName, StoreItemType, detailList } from './types'

// 实验室类型列表
export const getLaboratoryList = () => {
  return myRequest.post<RootObject<RequestDataLabName>>({
    url: '/schooldvc/Laboratory/laboratoryList'
  })
}

export const storeByLaboratory = (data: { id: number }) => {
  return myRequest.post<RootObject<StoreItemType[]>>({
    url: '/schooldvc/InstrumentStore/storeByLaboratory',
    data
  })
}

// 仪器设备库存总览
export const getEquList = (data: any) => {
  return myRequest.post<RootObject<equList>>({
    url: '/schooldvc/SchoolEquipment/equipmentList',
    data
  })
}

// 仪器调拨
export const postAllotList = (data: allotList) => {
  return myRequest.post<RootObject<allotList>>({
    url: '/schooldvc/SchoolInstrument/instrumentTransfers',
    data
  })
}

// 仪器入库
export const postWarehousingList = (data: WarehousingList) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/instrumentAdd',
    data
  })
}

//仪器盘点
export const postCheckList = (data: checkList) => {
  return myRequest.post<RootObject<checkList>>({
    url: '/schooldvc/SchoolInstrument/instrumentInventory',
    data
  })
}

//设备详情
export const getDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<detailList>>({
    url: '/schooldvc/SchoolEquipment/equipmentDetail',
    data
  })
}
//设备调拨
export const equTransfer = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipment/equipmentTransfers',
    data
  })
}
//设备bianji
export const equEdit = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipment/equipmentEdit',
    data
  })
}

//设备闲置启用
export const inIdle = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipment/equipmentInIdle',
    data
  })
}
