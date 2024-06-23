import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  repairList,
  instrumnetList,
  addRepairList,
  repairDetailList,
  damageList,
  repairFinishList,
  RequestDataLabName,
  StoreItemType,
  postRepairRegistrationInfo,
  scrapRegistrationList
} from './types'

export const getLaboratoryList = (data: { subject: any }) => {
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

// 获取维修保养列表
export const getRepairRegistrationList = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<repairList>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/instrumentMaintainList',
    data
  })
}

// 获取搜索到的仪器信息
export const getInstrumentInfo = (data: any) => {
  return myRequest.post<RootObject<instrumnetList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrument',
    data
  })
}

// 提交新增的仪器维修保养信息
export const postAddRepairInfo = (data: addRepairList) => {
  return myRequest.post<RootObject<addRepairList>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/schoolInstrumentAdd',
    data
  })
}

// 查看详情信息
export const getDetailInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<repairDetailList>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/maintainListing',
    data
  })
}

// 查看详情（损耗报废清单）
export const getDamageDetailInfo = (data: { number: string }) => {
  return myRequest.post<RootObject<damageList>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/maintainChangeScrap',
    data
  })
}

// 删除列表
export const deleteRepairList = (data: { id: number }) => {
  return myRequest.post<RootObject<string>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/delMaintainList',
    data
  })
}

// 获取维修完成登记信息
export const getRepairFinishData = (data: { id: number }) => {
  return myRequest.post<RootObject<repairFinishList>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/maintainRegistrationList',
    data
  })
}

// 提交维修完成登记信息
export const postRepairFinishInfo = (data: postRepairRegistrationInfo) => {
  return myRequest.post<RootObject<postRepairRegistrationInfo>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/maintainRegistration',
    data
  })
}

//提交维修转损耗、报废登记数据
export const postScrapRegistrationList = (data: scrapRegistrationList) => {
  return myRequest.post<RootObject<scrapRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsMaintain/maintainScrap',
    data
  })
}
