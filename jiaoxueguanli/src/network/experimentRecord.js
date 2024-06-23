import { request } from './request'

// 实验课记录数据
export function recordStatistical(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/recordStatistical',
    data,
  })
}
export function findappendexp(data) {
  return request({
    method: 'post',
    url: '/swrteach/Evaluation/findAppendExp',
    data,
  })
}
export function notnotevaluationme(data) {
  return request({
    method: 'post',
    url: '/teach/Evaluation/notnotevaluationme',
    data,
  })
}
export function find(data) {
  return request({
    method: 'post',
    url: '/teach/Evaluation/find',
    data,
  })
}

export function ExpEvaluationStudent(data) {
  return request({
    method: 'post',
    url: '/teach/ExpEvaluationStudent/findProcess',
    data,
  })
}

// 在线实验报告记录
export function getstudentgroup(data) {
  return request({
    method: 'post',
    url: '/teach/ExpResourcesReportTemplet/getstudentgroup',
    data,
  })
}

// 在线实验报告记录详情
export function findExpResourcesReportTempletbystudent(data) {
  return request({
    method: 'post',
    url: '/teach/ExpResourcesReportTemplet/findExpResourcesReportTempletbystudent',
    data,
  })
}

// 在线实验报告记录详情
export function updatestudentgroup(data) {
  return request({
    method: 'post',
    url: '/teach/ExpResourcesReportTemplet/updatestudentgroup',
    data,
  })
}

// 实验课记录摄像头记录
export function getVideo(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getVideo',
    data,
  })
}

// 实验课记录仪器
export function getInsDetail(data) {
  return request({
    method: 'post',
    url: 'teach/ExpBookMaterial/detail',
    data,
  })
}

// 实验课记录单条数据
export function getOne(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getOne',
    data,
  })
}
// 实验课课中单条数据
export function getReportOne(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getReportOne',
    data,
  })
}

// 实验课课后单条数据
export function getAfterOne(data) {
  return request({
    method: 'post',
    url: 'teach/HPresults/getAfterOne',
    data,
  })
}

// v12记录
export function selectTeachV12Exp(data) {
  return request({
    method: 'post',
    url: '/terminal/Teachv12expres/selectTeachV12Exp',
    data,
  })
}

// 教师操作演示记录
export function selectTeachExpBookVideos(data) {
  return request({
    method: 'post',
    url: '/terminal/Teachexpbookvideos/selectTeachExpBookVideos',
    data,
  })
}
