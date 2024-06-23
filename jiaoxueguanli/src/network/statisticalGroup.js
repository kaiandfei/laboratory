import { request } from './request'

// 今日开课（备课组长）
export function todayClass(data) {
  return request({
    method: 'post',
    url: 'teach/StatisticalGroup/classToday',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 开课统计（备课组长）
export function goClass(data) {
  return request({
    method: 'post',
    url: 'teach/StatisticalGroup/havClasses',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 教室列表（备课组长）
export function teacherList(data) {
  return request({
    method: 'post',
    url: 'teach/StatisticalGroup/teacherList',
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
    url: 'teach/StatisticalGroup/expFrequency',
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
    url: 'teach/StatisticalGroup/beforeClass',
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
    url: 'teach/StatisticalGroup/beforeClassCompletion',
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
    url: 'teach/StatisticalGroup/beforeClassBack',
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
    url: '/teach/StatisticalGroup/reportClass',
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
    url: '/teach/StatisticalGroup/reportClassCompletion',
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
    url: 'teach/StatisticalGroup/reportClassBack',
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
    url: '/teach/StatisticalGroup/afterClass',
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
    url: '/teach/StatisticalGroup/afterClassCompletion',
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
    url: 'teach/StatisticalGroup/afterClassBack',
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
    url: '/teach/StatisticalGroup/reportClassPic',
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
    url: '/teach/StatisticalGroup/reportClassCompletionPic',
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
    url: '/teach/StatisticalGroup/reportClassBackPic',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 我收到的评价（教师）
export function commentsReceived(data) {
  return request({
    method: 'post',
    url: '/teach/StatisticalGroup/commentsReceived',
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
    url: '/teach/StatisticalGroup/commentsReceivedAvg',
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
    url: '/teach/StatisticalGroup/commentsReceivedAll',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 我的状态（教师）
export function teacherStatus(data) {
  return request({
    method: 'post',
    url: '/teach/StatisticalGroup/teacherStatus',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 我的课程（教师）
export function teacherClassList(data) {
  return request({
    method: 'post',
    url: '/teach/StatisticalGroup/teacherClassList',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
