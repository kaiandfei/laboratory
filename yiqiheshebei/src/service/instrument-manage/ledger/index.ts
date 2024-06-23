import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { SearchForm, LedgerStatistical, LedgerList, LedgerDetailList } from './types'

// 教学仪器总览
export const getLedgerList = (data: SearchForm) => {
  return myRequest.post<RootObject<LedgerList>>({
    url: '/schooldvc/SchoolGeneralLedger/generalLedgerList',
    data
  })
}

// 教学仪器总览总价值统计
export const getLedgerStatistical = (data: SearchForm) => {
  return myRequest.post<RootObject<LedgerStatistical[]>>({
    url: '/schooldvc/SchoolGeneralLedger/generalLedgerStatistical',
    data
  })
}

// 明细详情
export const getDetails = (data: { page: number; id: number }) => {
  return myRequest.post<RootObject<LedgerDetailList>>({
    url: '/schooldvc/SchoolGeneralLedger/detail',
    data
  })
}

// 教学分类账
export const getClassify = (data: SearchForm) => {
  return myRequest.post<RootObject<LedgerList>>({
    url: '/schooldvc/SchoolGeneralLedger/classify',
    data
  })
}

// 教学分类账统计
export const getClassifyStatistical = (data: SearchForm) => {
  return myRequest.post<RootObject<LedgerStatistical[]>>({
    url: '/schooldvc/SchoolGeneralLedger/classifyStatistical',
    data
  })
}
// 低易耗品账
export const getLowStatistical = (data: any) => {
  return myRequest.post<RootObject<LedgerDetailList>>({
    url: '/schooldvc/SchoolGeneralLedger/LowStatistical',
    data
  })
}
// 低易耗品账统计
export const getclassifyLowStatistical = (data: any) => {
  return myRequest.post<RootObject<LedgerStatistical[]>>({
    url: '/schooldvc/SchoolGeneralLedger/classifyLowStatistical',
    data
  })
}
