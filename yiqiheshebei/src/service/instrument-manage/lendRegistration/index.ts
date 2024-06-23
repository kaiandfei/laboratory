import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  lendList,
  lendDetailList,
  lendDetailInventoryList,
  returnRegistrationList,
  RequestDataLabName,
  StoreItemType,
  returnInfoList,
  instrumnetList,
  getSchoolTeacherList,
  addLendInstrumnetInfoList,
  repairRegistrationList,
  scrapRegistrationList,
  damageRegistrationList
} from './types'

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

// 获取出借列表
export const getLendList = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<lendList>>({
    url: '/schooldvc/SchoolInstrumentsLend/instrumentLendList',
    data
  })
}

// 获取仪器信息（搜索功能）
export const getInstrumentInfo = (data: any) => {
  return myRequest.post<RootObject<instrumnetList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrument',
    data
  })
}

// 获取学校教师信息列表
export const getTeacherList = (data: { id: number }) => {
  return myRequest.post<RootObject<getSchoolTeacherList[]>>({
    url: '/schooldvc/User/teacherList',
    data
  })
}

//新增出借仪器（出借仪器信息提交）
export const postLendInstrumnetInfo = (data: addLendInstrumnetInfoList) => {
  return myRequest.post<RootObject<getSchoolTeacherList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrumentAdd',
    data
  })
}

// 获取出借仪器详情
export const getLendDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<lendDetailList>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnListing',
    data
  })
}

// 获取出借详情下方清单列表数据
export const getLendDetailInventoryList = (data: { number: string; type: number }) => {
  return myRequest.post<RootObject<lendDetailInventoryList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnChangeType',
    data
  })
}

// 出借仪器列表删除
export const delInstrumentList = (data: { id: number }) => {
  return myRequest.post<RootObject<lendList[]>>({
    url: '/schooldvc/SchoolInstrumentsLend/delReturnList',
    data
  })
}

// 获取归还登记列表
export const getReturnRegistrationList = (data: { id: number }) => {
  return myRequest.post<RootObject<returnRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnRegistrationList',
    data
  })
}

//提交归还信息
export const postReturnInfo = (data: returnInfoList) => {
  return myRequest.post<RootObject<returnInfoList>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnRegistration',
    data
  })
}

// 提交归还转维修保养登记信息
export const postRepairRegistrationList = (data: repairRegistrationList) => {
  return myRequest.post<RootObject<repairRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnMaintenance',
    data
  })
}

// 提交归还转损耗、报废登记信息
export const postScrapRegistrationList = (data: scrapRegistrationList) => {
  return myRequest.post<RootObject<scrapRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnScrap',
    data
  })
}

// 提交归还转损坏、赔偿登记信息
export const postDamageRegistrationList = (data: damageRegistrationList) => {
  return myRequest.post<RootObject<damageRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsLend/returnDamage',
    data
  })
}
export const schoolInstrumentDetail = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInstrumentsLend/schoolInstrumentDetail',
    data
  })
}
