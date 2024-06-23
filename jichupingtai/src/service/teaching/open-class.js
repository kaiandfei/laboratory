import { teachRequest } from '../token/index'

// 获取列表
export function getPageData(data) {
  return teachRequest.post({
    url: '/teach/EvaluationProjectTemplate/getPageData',
    data
  })
}

// 获取列表单条
export function findEvaluationProjectTemplate(data) {
  return teachRequest.post({
    url: '/swrteach/EvaluationProjectTemplate/findEvaluationProjectTemplate',
    data
  })
}

// 新增
export function saveTemplate(data) {
  return teachRequest.post({
    url: '/teach/EvaluationProjectTemplate/save',
    data
  })
}

// 导入
export function uploadEvaluationProjectTemplate(data) {
  return teachRequest.post({
    url: '/teach/EvaluationProjectTemplate/uploadEvaluationProjectTemplate',
    data
  })
}

// 删除
export function deleteTemplate(data) {
  return teachRequest.post({
    url: '/teach/EvaluationProjectTemplate/delete',
    data
  })
}
