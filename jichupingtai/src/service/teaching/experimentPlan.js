import { teachRequest } from '../token/index'
// import { IServerDataType } from '../token/types'

export const findh5p = (data) => {
  return teachRequest.post({
    url: '/teach/H5pH5pContents/find',
    data
  })
}

export const goClass = () => {
  return teachRequest.post({
    url: '/teach/GoClass/find'
  })
}

// 实验方案查询
export function ExpMaterialFind(data) {
  return teachRequest.post({
    url: 'teach/Material/find',
    data
  })
}

// 新增教学计划
export function addPlan(data) {
  return teachRequest.post({
    url: 'teach/expPlan/savePlan',
    data
  })
}
// 计划详情
export function planDetails(data) {
  return teachRequest.post({
    url: 'teach/expPlan/expPlanDetail',
    data
  })
}
// 删除计划
export function delExpPlan(data) {
  return teachRequest.post({
    url: 'teach/expPlan/delExpPlan',
    data
  })
}
// 删除实验计划
export function delOnePlan(data) {
  return teachRequest.post({
    url: 'teach/expPlan/delOnePlan',
    data
  })
}
// 获取实验室列表type 1,系统推荐,type 2 我的
export function expPlanList(data) {
  return teachRequest.post({
    url: 'teach/expPlan/expListSchool',
    data
  })
}
// 实验室列表
export function laboratoryByUser() {
  return teachRequest.post({
    url: 'teach/expBook/laboratoryByUser'
  })
}

// 实验仪器查询
export function findExpMaterialbynumber(data) {
  return teachRequest.post({
    url: 'teach/ExpMaterial/findExpMaterialbynumber',
    data
  })
}

// 新增实验方案
export function Experiment(data) {
  return teachRequest.post({
    url: 'teach/Exp/Save',
    data
    // params: {
    //   groupId: data
    // }
  })
}
// 实验仪器查询
export function deleteImage(data) {
  return teachRequest.post({
    url: 'teach/OssImage/deleteImage',
    data
  })
}
// 根据ID查询实验方案详情
export function findDetail(data) {
  return teachRequest.post({
    url: '/teach/Exp/find',
    data
  })
}
// 实验仪器查询
export function findSections(data) {
  return teachRequest.post({
    url: '/teach/Sections/find',
    data
  })
}

// 实验模版查询
export function findExpResourcesReportTempletbyteacher(data) {
  return teachRequest.post({
    url: '/teach/ExpResourcesReportTemplet/findExpResourcesReportTempletbyteacher',
    data
  })
}
