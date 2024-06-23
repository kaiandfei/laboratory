import { myRequest } from '../token/index'
import { RootObject } from '../rootObject'
import {
  StoreListType,
  InstrumentDetail,
  StoreDetailType,
  EquDetailType,
  InsEquDetailType,
  AddForm,
  BatchAddForm
} from './types'

// 仪器设备库列表
export const getStoreList = (data: { subject_id: number }) => {
  return myRequest.post<RootObject<StoreListType[]>>({
    url: '/schooldvc/InstrumentStore/storelist',
    data
  })
}

// 库存详情
export const getStoreDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<StoreDetailType[]>>({
    url: '/schooldvc/InstrumentStore/storeDetail',
    data
  })
}

// 仪器柜详情(还没使用)
export const getInstrumentDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<InstrumentDetail>>({
    url: '/schooldvc/InstrumentStore/instrumentDetail',
    data
  })
}

// 仪器详情(待修改)
export const getEquDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<EquDetailType>>({
    url: '/schooldvc/InstrumentStore/instrumentEquipment',
    data
  })
}

// 仪器以及设备详情
export const getInsEquDetail = (data: {
  id: number
  type: number
  total: number
  laboratory_id: number
  store_id: any
  number_plies: number
}) => {
  return myRequest.post<RootObject<InsEquDetailType>>({
    url: '/schooldvc/InstrumentStore/equipmentDetail',
    data
  })
}

// 新增修改仪器柜
export const addInstrument = (data: AddForm) => {
  return myRequest.post<RootObject<InsEquDetailType>>({
    url: '/schooldvc/InstrumentStore/instrumentSave',
    data
  })
}

// 批量新增仪器柜
export const batchAddInstrument = (data: BatchAddForm) => {
  return myRequest.post<RootObject<InsEquDetailType>>({
    url: '/schooldvc/InstrumentStore/instrumentAdd',
    data
  })
}

// 删除仪器柜
export const delStore = (data: { id: number }) => {
  return myRequest.post<RootObject<InsEquDetailType>>({
    url: '/schooldvc/InstrumentStore/storeDel',
    data
  })
}
