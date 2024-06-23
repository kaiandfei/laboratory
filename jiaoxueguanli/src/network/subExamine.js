import { request } from './request'

// 实验室预约表格数据
export function adjustLaboratory(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/adjustLaboratory',
    data,
  })
}

// // 根据学科获取实验室
// export function laboratoryBySubject(data) {
//   return request({
//     method: 'post',
//     url: 'teach/expBook/laboratoryBySubject',
//     data
//   })
// }

// 根据用户获取实验室
export function getLaboratoryByUser(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/laboratoryByUser',
    data,
  })
}

// 预约仪器
export function examInstrument(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBookMaterial',
    data,
  })
}

// 仪器添加
export function findSchoolIns(data) {
  return request({
    method: 'post',
    url: 'teach/Material/findSchool',
    data,
  })
}

// 待确定仪器清单
export function insList(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/index',
    data,
  })
}

// 确定仪器清单详情
export function insDetailList(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/detail',
    data,
  })
}

// 仪器调整
export function insAdjustment(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/getMaterialPosition',
    data,
  })
}

// 仪器清单确认
export function insConfirm(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/confirm',
    data,
  })
}

// 仪器准备好了
export function readyMaterial(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/readyMaterial',
    data,
  })
}

// 预约仪器确认信息导出
export function Materialexport(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/Materialexport',
    data,
  })
}

// 仪器导出
export function instrumentExport(data) {
  return request({
    method: 'post',
    url: 'teach/Excel/instrumentExport',
    data,
  })
}

// 预约删除
export function expBookDel(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBookDel',
    data,
  })
}

// 预约仪器调整
export function addBookMaterial(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/addBookMaterial',
    data,
  })
}

// 获取冲突详情
export function getConflict(data) {
  return request({
    method: 'post',
    url: 'teach/laboratory/conflict',
    data,
  })
}
