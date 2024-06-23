import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { BaseListType } from './types'

// 学校推荐采购计划详情
export const getBuyPlan = (data: { type: number; subject_id: number }) => {
  return myRequest.post<
    RootObject<{
      create_time: string
      update_time: string
      data: BaseListType[]
    }>
  >({
    url: '/schooldvc/SchoolBuyPlanDetail/schoolBuyPlanDetailCreate',
    data
  })
}

// 加入区域采购计划
export const savePlan = (data: { id: number; submit_money: number; schoolbuyplandetail: BaseListType[] }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanDetail/Save',
    data
  })
}

// 修改更新
export const cacheUpdate = (data: { id: number; adjustCount: number; priceReference: number; number: string }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanDetail/cache_update',
    data
  })
}
