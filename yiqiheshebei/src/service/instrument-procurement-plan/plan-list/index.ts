import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { ListItem, InsStoreDetail, DetailType, EditFormDetail, EditForm } from './types'
import { BatchWarehousingList } from '@/service/instrument-manage/batch-instrument-warehouse/types'

// 采购计划列表
export const planList = (data: { title: string; audit: number | string }) => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/schooldvc/SchoolBuyPlanSubject/findBuyPlanforSchoollab',
    data
  })
}

// 采购计划列表上报
export const planListAppear = (data: { submit_desc?: string; id: number; audit: number }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanSubject/updateaudit',
    data
  })
}

// 计划列表删除
export const delPlanList = (data: { id: number }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanSubject/delete',
    data
  })
}

// 采购计划列表新建发布列表
export const planListAddReport = () => {
  return myRequest.post<RootObject<ListItem[]>>({
    url: '/schooldvc/SchoolBuyPlanSubject/chooseBuyPlanforSchoollab'
  })
}

// 计划编辑
export const planListAddReportOfDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<EditFormDetail>>({
    url: '/schooldvc/SchoolBuyPlanSubject/labeditSchoolBuyPlanwithDetail',
    data
  })
}

// 计划编辑保存
export const saveEditPlan = (data: EditForm) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanSubject/Save',
    data
  })
}

// 学校推荐采购计划详情 查询
export const getSchoolBuyPlanDetail = (data: { buy_plan_subject_id: number; type: number }) => {
  return myRequest.post<RootObject<DetailType[]>>({
    url: '/schooldvc/SchoolBuyPlanDetail/findSchoolBuyPlanDetail',
    data
  })
}

// 批量入库
export const postBatchInstrumentCg = (data: { data: BatchWarehousingList[] }) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/instrumentBatchAddcg',
    data
  })
}

// 设备入库
export const equipmentAddcg = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolInstrument/equipmentAddcg',
    data
  })
}

// 入库详情
export const instrumentStoreDetail = () => {
  return myRequest.post<RootObject<InsStoreDetail[]>>({
    url: '/schooldvc/SchoolBuyPlanDetail/instrumentStoreDetail'
  })
}

// 学校新建采购计划
export const addSchoolBuyPlan = (data: EditForm) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlan/save',
    data
  })
}

// 验收
export const planCheck = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanDetail/is_check',
    data
  })
}

// 已入库
export const getSchoolBuyPlanSubjectDetail = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolBuyPlanDetail/getSchoolBuyPlanSubjectDetail',
    data
  })
}
