import { request } from './request'

// 预习结果反馈数据
export function previewData(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getTj',
    data,
  })
}

// 课中反馈数据
export function getReportData(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getReport',
    data,
  })
}

// 复习结果反馈数据
export function getAfterData(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getAfter',
    data,
  })
}

// 查看学生数据
export function getStudentsName(data) {
  return request({
    method: 'post',
    url: 'teach/Student/getStudent',
    data,
  })
}

// 存入学生作业（课中作业）
export function uploadReport(data) {
  return request({
    method: 'post',
    url: 'teach/Student/uploadReport',
    data,
  })
}

// 存入学生作业（课后作业）
export function uploadAfter(data) {
  return request({
    method: 'post',
    url: 'teach/Student/uploadAfter',
    data,
  })
}

// 删除学生作业（课中作业）
export function delStudentReport(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/delStudentReport',
    data,
  })
}

// 删除学生作业（课后作业）
export function delStudentAfter(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/delStudentAfter',
    data,
  })
}
