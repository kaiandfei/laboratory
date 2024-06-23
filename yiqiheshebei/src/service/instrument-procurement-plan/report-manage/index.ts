import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { ListItem, RequestData, DetailType, SavaFormData, DetailBuyPlan, DetailBuyPlanList } from './types'

// 采购计划发布展示 (未分页)
export const reportList = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: 'schooldvc/BuyPlan/findBuyPlan'
  })
}

// 采购计划发布展示 (分页)
export const reportListOfpage = (data: { page: number }) => {
  return myRequest.post<RootObject<RequestData>>({
    url: 'schooldvc/BuyPlan/getPageData',
    data
  })
}

// 采购计划发布(新建|修改)
export const editReport = (data: { id?: number }) => {
  return myRequest.post<RootObject<DetailType>>({
    url: 'schooldvc/BuyPlan/create',
    data
  })
}

// 采购计划发布(新建|修改)
export const saveReport = (data: SavaFormData) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/BuyPlan/Save',
    data
  })
}

// 采购计划发布与撤回
export const updateStatus = (data: { id: number; is_push: number }) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/BuyPlan/updatestatus',
    data
  })
}

// 采购计划详情列表
export const buyPlanDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<DetailBuyPlan>>({
    url: '/schooldvc/BuyPlan/findBuyPlanwithSchool',
    data
  })
}

// 采购计划详情列表采购清单
export const buyPlanDetailList = (data: { id: number }) => {
  return myRequest.post<RootObject<DetailBuyPlanList>>({
    url: '/schooldvc/SchoolBuyPlan/findSchoolBuyPlanbySubject',
    data
  })
}

// 采购计划删除
export const deleteItem = (data: { id: number }) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/BuyPlan/delete',
    data
  })
}

// 采购计划非区域
export const findBuyPlanwithSchool = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/schooldvc/SchoolBuyPlan/findBuyPlanwithSchool'
  })
}

// 采购计划审核
export const planListAppear = (data: { submit_desc?: string; id: number; audit: number }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlan/updateaudit',
    data
  })
}
