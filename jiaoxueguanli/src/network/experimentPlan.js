import { request } from './request'

// 获取token
export function token(data) {
  return request({
    method: 'post',
    url: '/admin/Login/in',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 获取学年计划列表
export function getCompany(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/expPlanList',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 新增实验方案
export function Experiment(data) {
  return request({
    method: 'post',
    url: 'teach/Exp/Save',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 删除实验计划
export function delOnePlan(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/delOnePlan',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 新增实验方案
export function DeleteExperiment(data) {
  return request({
    method: 'post',
    url: 'teach/Exp/delete',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 计划详情
export function planDetails(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/expPlanDetail',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 取消默认计划
export function planCancel(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/cancelDefault',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 获取实验室列表type 1,系统推荐,type 2 我的
export function expPlanList(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/expListSchool',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 获取计划模板
export function expPlanTemp(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/expPlanTemp',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 实验室预约表格数据
export function goClass(data) {
  return request({
    method: 'post',
    url: '/teach/GoClass/find',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 新增教学计划
export function addPlan(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/savePlan',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 删除计划
export function delExpPlan(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/delExpPlan',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 实验方案查询
export function Select(data) {
  return request({
    method: 'get',
    url: 'teach/Exp/Select',
    params: data,
  })
}

// 实验方案查询
export function ExpMaterialFind(data) {
  return request({
    method: 'post',
    url: 'teach/Material/find',
    data,
  })
}

// 实验模版查询
export function findExpResourcesReportTempletbyteacher(data) {
  return request({
    method: 'post',
    url: '/teach/ExpResourcesReportTemplet/findExpResourcesReportTempletbyteacher',
    data,
  })
}

// 实验仪器查询
export function findExpMaterialbynumber(data) {
  return request({
    method: 'get',
    url: 'teach/ExpMaterial/findExpMaterialbynumber',
    params: data,
  })
}

// 实验仪器查询
export function deleteImage(data) {
  return request({
    method: 'post',
    url: 'teach/OssImage/deleteImage',
    data,
  })
}

// 实验仪器查询
export function findSections(data) {
  return request({
    method: 'post',
    url: '/teach/Sections/find',
    data,
  })
}

// 根据ID查询实验方案详情
export function findDetail(data) {
  return request({
    method: 'post',
    url: '/teach/Exp/find',
    data,
  })
}
// 根据ID查询实验方案详情
export function findDetailSingle(data) {
  return request({
    method: 'post',
    url: '/mobile/Exp/find',
    data,
  })
}

// 实验仪器查询
export function findh5p(data) {
  return request({
    method: 'post',
    url: '/teach/H5pH5pContents/find',
    data,
  })
}

// 课前资料查询
export function findMobile(data) {
  return request({
    method: 'post',
    url: '/swrmobile/Sections/find',
    data,
  })
}
// 实验室列表
export function laboratoryByUser() {
  return request({
    method: 'post',
    url: 'teach/expBook/laboratoryByUser',
  })
}

// 待开放实验室列表
export function getLaboratoryByPlan(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/getLaboratoryByPlan',
    data,
  })
}

// 开放实验室
export function openLab(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/expOpenLaboratory',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 关闭实验室开放
export function closeLab(data) {
  return request({
    method: 'post',
    url: 'teach/expPlan/expCloseLaboratory',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 复制实验方案
export function copyExp(data) {
  return request({
    method: 'post',
    url: 'teach/Exp/copy_exp',
    data,
  })
}

// 创建课程大纲
export function outlineSave(data) {
  return request({
    method: 'post',
    url: 'serve/ClassOutline/save',
    data,
  })
}

// 查询列表课程大纲
export function getPageData(data) {
  return request({
    method: 'post',
    url: 'serve/ClassOutline/getPageData',
    data,
  })
}
// 查询单条课程大纲
export function findClassOutline(data) {
  return request({
    method: 'post',
    url: 'serve/ClassOutline/findClassOutline',
    data,
  })
}
// 删除课程大纲
export function outlineDelete(data) {
  return request({
    method: 'post',
    url: 'serve/ClassOutline/delete',
    data,
  })
}
