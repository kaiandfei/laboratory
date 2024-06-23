import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  scrapRegistrationList,
  instrumnetList,
  addScrapList,
  scrapDetailInfo,
  editScrapInfoDetail,
  RequestDataLabName,
  StoreItemType,
  editScrapInfo,
  instrumentExamineList
} from './types'

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

// 获取设备损耗、报废登记列表信息
export const getScrapRegistrationlist = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<scrapRegistrationList>>({
    url: '/schooldvc/SchoolEquipmentScrap/equipmentScrapList',
    data
  })
}

// 获取搜索到的设备信息
export const getInstrumentInfo = (data: { keyword: string }) => {
  return myRequest.post<RootObject<instrumnetList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrument',
    data
  })
}

//提交新增的设备损耗、报废登记信息
export const postAddScrapInfo = (data: addScrapList) => {
  return myRequest.post<RootObject<addScrapList>>({
    url: '/schooldvc/SchoolEquipmentScrap/schoolEquipmentAdd',
    data
  })
}

//获取损耗、报废详情
export const getScrapDetailInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolEquipmentScrap/scrapRegistrationList',
    data
  })
}

//删除损耗、报废信息
export const deleteScrapList = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolEquipmentScrap/delScrapList',
    data
  })
}

//提交审核申请
export const submitScrapInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolEquipmentScrap/scrapSubmit',
    data
  })
}

//撤回提交的损耗、报废信息
export const withdrawScrapInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolEquipmentScrap/ScrapWithdraw',
    data
  })
}

//获取编辑所对应的设备信息
export const getEditScrapInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<editScrapInfoDetail>>({
    url: '/schooldvc/SchoolEquipmentScrap/scrapEdit',
    data
  })
}

// 编辑时删除设备信息
export const deleteEquInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<editScrapInfoDetail>>({
    url: '/schooldvc/SchoolEquipmentScrap/delOne',
    data
  })
}

//提交编辑的设备损耗、报废登记信息
export const postEditScrapInfo = (data: editScrapInfo) => {
  return myRequest.post<RootObject<editScrapInfo>>({
    url: '/schooldvc/SchoolEquipmentScrap/schoolEquipmentAdd',
    data
  })
}

//提交仪器审核信息
export const postInstrumentExamineInfo = (data: instrumentExamineList) => {
  return myRequest.post<RootObject<instrumentExamineList>>({
    url: '/schooldvc/SchoolEquipmentScrap/scrapAudit',
    data
  })
}
