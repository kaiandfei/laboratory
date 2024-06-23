import { request } from './request'

// 今日开课（教师）
export function todayClass(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/classToday',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 开课统计（教师）
export function goClass(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/havClasses',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 开课频率（教师）
export function expFrequency(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/expFrequency',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 本周实验类型（教师）
export function expType(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/expType',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课前预习次数（教师）
export function beforeClass(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/beforeClass',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课前预习完成率（教师）
export function beforeClassCompletion(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/beforeClassCompletion',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课前预习反馈（教师）
export function beforeClassback(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/beforeClassBack',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中次数（教师）
export function reportClass(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/reportClass',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中次数（教师）
export function reportClassCompletion(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/reportClassCompletion',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中反馈（教师）
export function reportClassback(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/reportClassBack',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课后次数（教师）
export function afterClass(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/afterClass',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课后次数（教师）
export function afterClassCompletion(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/afterClassCompletion',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课后反馈（教师）
export function afterClassback(data) {
  return request({
    method: 'post',
    url: 'teach/statistical/afterClassBack',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中图片统计（教师）
export function reportClassPic(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/reportClassPic',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中图片上传率（教师）
export function reportClassCompletionPic(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/reportClassCompletionPic',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中评价反馈（教师）
export function reportClassBackPic(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/reportClassBackPic',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中评价反馈（教师）
export function commentsReceived(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/commentsReceived',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中评价反馈平均（教师）
export function commentsReceivedAvg(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/commentsReceivedAvg',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 学生课中评价反馈累计评价反馈（教师）
export function commentsReceivedAll(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/commentsReceivedAll',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 我的状态（教师）
export function myStatus(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/myStatus',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 我的课程（教师）
export function myClassList(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/myClassList',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
