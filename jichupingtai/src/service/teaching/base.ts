import { teachRequest } from '../token/index'
import { IServerDataType } from '../token/types'

// 实验方案查询
export const getExpList = (data: any) => {
  return teachRequest.post<IServerDataType<any>>({
    url: '/school/Exp/Select',
    data
  })
}

// 更新状态
export const updateIsshow = (data: { id: number; is_show: number }) => {
  return teachRequest.post<IServerDataType<any>>({
    url: '/school/Exp/updateIsshow',
    data
  })
}

// 更新状态
export const updatePlanIsshow = (data: { id: number; is_show: number }) => {
  return teachRequest.post<IServerDataType<any>>({
    url: '/school/expPlan/updateIsshow',
    data
  })
}

// 获取学年计划列表
export function expPlanList(data: any) {
  return teachRequest.post<IServerDataType<any>>({
    url: 'school/expPlan/expPlanList',
    data
  })
}

// 导入计划
export function importPlan(data: any) {
  return teachRequest.post<IServerDataType<any>>({
    url: '/teach/expPlan/importPlan',
    data
  })
}

// 删除计划
export function delExpPlan(data: { id: number }) {
  return teachRequest.post<IServerDataType<any>>({
    url: 'school/expPlan/delExpPlan',
    data
  })
}

// 导入方案
export function importExp(data: any) {
  return teachRequest.post<IServerDataType<any>>({
    url: '/teach/Exp/saveExcelData',
    data
  })
}

// 删除方案
export function deleteExperiment(data: { id: number }) {
  return teachRequest.post<IServerDataType<any>>({
    url: 'school/Exp/delete',
    data
  })
}
