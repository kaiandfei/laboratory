import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { InstrumentAllType, BatchWarehousingList } from './types'

// 学校或者标准仪器列表
export const getInstrumentOfType = (data: { page: number; type: number; base: number; keyword: string; limit: number }) => {
  return myRequest.post<RootObject<InstrumentAllType>>({
    url: '/schooldvc/SchoolInstrument/instrumentAll',
    data
  })
}
// 学校设备列表
export const getEquipmentOfType = (data: any) => {
  return myRequest.post<RootObject<InstrumentAllType>>({
    url: 'schooldvc/SchoolEquipment/equipmentList',
    data
  })
}

// 批量新增
export const postBatchInstrument = (data: { list: BatchWarehousingList[], voucher_number:string,bacth:string,factory:string,factory_mobile:number,source:number }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/instrumentBatchAdd',
    data
  })
}

// 存入仪器入库草稿
export const addInstrumentDraft = (data: { json_array:string }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/addInstrumentDraft',
    data
  })
}

// 清除仪器入库草稿
export const clearInstrumentDraft = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/clearInstrumentDraft',
    data
  })
}

// 获取仪器入库草稿
export const getInstrumentDraft = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/getInstrumentDraft',
    data
  })
}

// 入库记录
export const instrumentRecord = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/instrumentRecord',
    data
  })
}
// 入库记录详情
export const instrumentRecordDetail = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/instrumentRecordDetail ',
    data
  })
}

// 批量新增设备
export const postBatchEqu = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipment/equipmentBatchAdd',
    data
  })
}

// 设备入库记录
export const equipmentRecord = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipment/equipmentRecord',
    data
  })
}
// 设备入库记录详情
export const equipmentRecordDetail = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipment/equipmentRecordDetail ',
    data
  })
}
