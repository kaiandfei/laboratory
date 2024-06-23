import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  inventoryList,
  allotList,
  WarehousingList,
  checkList,
  RequestDataLabName,
  StoreItemType,
  detailList
} from './types'

// 实验室类型列表
export const getLaboratoryList = (data?: any) => {
  return myRequest.post<RootObject<RequestDataLabName>>({
    url: '/schooldvc/Laboratory/laboratoryList',
    data
  })
}

export const storeByLaboratory = (data: { id: number }) => {
  return myRequest.post<RootObject<StoreItemType[]>>({
    url: '/schooldvc/InstrumentStore/storeByLaboratory',
    data
  })
}

// 获取调拨位置信息
export const getAlllotlocation = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInstrument/instrumentTransfersLocation',
    data
  })
}

// 仪器设备库存总览
export const getInventoryList = (data: { subject_id: number; keyword: string; page: number }) => {
  return myRequest.post<RootObject<inventoryList>>({
    url: '/schooldvc/SchoolInstrument/instrumentList',
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

//仪器详情
export const getDetailList = (data: { id: number }) => {
  return myRequest.post<RootObject<detailList>>({
    url: '/schooldvc/SchoolInstrument/instrumentDetail',
    data
  })
}
