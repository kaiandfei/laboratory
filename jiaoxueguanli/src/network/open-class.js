import { request } from './request'

// 获取列表
export function getPageData(data) {
  return request({
    method: 'post',
    url: '/teach/EvaluationProjectTemplate/getPageData',
    data,
  })
}

// 获取列表单条
export function findEvaluationProjectTemplate(data) {
  return request({
    method: 'post',
    url: '/swrteach/EvaluationProjectTemplate/findEvaluationProjectTemplate',
    data,
  })
}

// 新增
export function saveTemplate(data) {
  return request({
    method: 'post',
    url: '/teach/EvaluationProjectTemplate/save',
    data,
  })
}

// 导入
export function uploadEvaluationProjectTemplate(data) {
  return request({
    method: 'post',
    url: '/teach/EvaluationProjectTemplate/uploadEvaluationProjectTemplate',
    data,
  })
}

// 删除
export function deleteTemplate(data) {
  return request({
    method: 'post',
    url: '/teach/EvaluationProjectTemplate/delete',
    data,
  })
}
