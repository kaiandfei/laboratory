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

// 获取仪器损耗、报废登记列表信息
export const getScrapRegistrationlist = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<scrapRegistrationList>>({
    url: '/schooldvc/SchoolInstrumentsScrap/instrumentScrapList',
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

//提交新增的仪器损耗、报废登记信息
export const postAddScrapInfo = (data: addScrapList) => {
  return myRequest.post<RootObject<addScrapList>>({
    url: '/schooldvc/SchoolInstrumentsScrap/schoolInstrumentAdd',
    data
  })
}

//获取损耗、报废详情
export const getScrapDetailInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolInstrumentsScrap/scrapRegistrationList',
    data
  })
}

//删除损耗、报废信息
export const deleteScrapList = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolInstrumentsScrap/delScrapList',
    data
  })
}

//提交审核申请
export const submitScrapInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolInstrumentsScrap/scrapSubmit',
    data
  })
}

//撤回提交的损耗、报废信息
export const withdrawScrapInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<scrapDetailInfo>>({
    url: '/schooldvc/SchoolInstrumentsScrap/ScrapWithdraw',
    data
  })
}

//获取编辑所对应的仪器信息
export const getEditScrapInfo = (data: { id: number }) => {
  return myRequest.post<RootObject<editScrapInfoDetail>>({
    url: '/schooldvc/SchoolInstrumentsScrap/scrapEdit',
    data
  })
}

//提交编辑的仪器损耗、报废登记信息
export const postEditScrapInfo = (data: editScrapInfo) => {
  return myRequest.post<RootObject<editScrapInfo>>({
    url: '/schooldvc/SchoolInstrumentsScrap/schoolInstrumentAdd',
    data
  })
}

//提交仪器审核信息
export const postInstrumentExamineInfo = (data: instrumentExamineList) => {
  return myRequest.post<RootObject<instrumentExamineList>>({
    url: '/schooldvc/SchoolInstrumentsScrap/scrapAudit',
    data
  })
}
