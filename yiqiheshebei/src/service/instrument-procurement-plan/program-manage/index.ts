import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { BaseType, DetailType } from './types'

// 采购计划管理
export const programList = (data:any) => {
  return myRequest.post<RootObject<BaseType[]>>({
    url: '/schooldvc/SchoolBuyPlan/findSchoolBuyPlanwithDetail',
    data
  })
}

// 采购计划管理详情
export const programListDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<DetailType>>({
    url: '/schooldvc/SchoolBuyPlan/findSchoolBuyPlanandSubject',
    data
  })
}

// 计划上报
export const reportPlan = (data: { id: number; audit: number }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlan/updateaudit',
    data
  })
}
