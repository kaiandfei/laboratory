import { request } from './request'

// 对学生课中评价分组查询
export function find(data) {
  return request({
    method: 'post',
    url: '/teach/ExpEvaluationStudent/find',
    data,
  })
}
// 课中实验课记录保存
export function ExpEvaluationStudentSave(data) {
  return request({
    method: 'post',
    url: '/teach/ExpEvaluationStudent/saveAll',
    data,
  })
}
// 老师自评保存
export function teachertSave(data) {
  return request({
    method: 'post',
    url: '/mobile/ExpEvaluationTeacher/save',
    data,
  })
}

// 对实验员评价保存
export function laboratoryUserSave(data) {
  return request({
    method: 'post',
    url: '/mobile/ExpEvaluationLaboratory/save',
    data,
  })
}

// 公开课评价查询
export function findproject(data) {
  return request({
    method: 'post',
    url: '/mobile/EvaluationProject/findproject',
    data,
  })
}

// 老师自评保存查询
export function teacherEvaluationfind(data) {
  return request({
    method: 'post',
    url: '/mobile/ExpEvaluationTeacher/find',
    data,
  })
}

// 对实验员评价保存
export function laboratoryUserEvaluationfind(data) {
  return request({
    method: 'post',
    url: '/mobile/ExpEvaluationLaboratory/find',
    data,
  })
}
// 课中实验记录查询
export function findStudentEvaluation(data) {
  return request({
    method: 'post',
    url: '/teach/ExpEvaluationStudent/findStudentEvaluation',
    data,
  })
}
