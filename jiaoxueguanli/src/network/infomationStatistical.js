import { request } from './request'
import store from '../store/index'

const roleMap = {
  1: 'statisticalAdmin',
  2: 'statisticalTester',
  3: 'StatisticalGroup',
  4: 'statistical',
  100: 'statisticalPro',
}

// 获取计划
export function getPlan(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/getPlan',
    data,
  })
}

// 获取计划详情

export function planDetailExp(data) {
  return request({
    method: 'post',
    url: '/teach/expPlan/planDetailExp',
    data,
  })
}

// 获取教师
export function getTeacher(data) {
  return request({
    method: 'post',
    url: '/teach/StatisticalGroup/getTeacher',
    data,
  })
}

// 今日我的开课数
export function classToday(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/classToday',
    data,
  })
}

// 今日教师开课数
export function teacherClassList(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/teacherClassList',
    data,
  })
}

// 实验开课率
export function classRate(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/classRate',
    data,
  })
}

// 实验频次(教师)
export function expFrequency(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/expFrequency',
    data,
  })
}

// 计划完成统计(教师)
export function expPlanDetail(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/expPlanDetail',
    data,
  })
}

// 教师进度统计
export function teacherComPro(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/teacherComPro',
    data,
  })
}

// 班级开课进度统计(教师)
export function courseSchedule(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/courseSchedule',
    data,
  })
}

// 教师开课资料统计(教师)
export function teacherCourse(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/teacherCourse',
    data,
  })
}

// 学生课前预习次数(教师)
export function beforeClass(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/beforeClass',
    data,
  })
}

// 学生课前数据统计完成率(教师)
export function beforeClassCompletion(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/beforeClassCompletion',
    data,
  })
}

// 学生课前预习反馈(教师)
export function beforeClassBack(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/beforeClassBack',
    data,
  })
}

// 学生课中报告统计(教师)
export function reportClass(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/reportClass',
    data,
  })
}

// 学生课中报告完成率(教师)
export function reportClassCompletion(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/reportClassCompletion',
    data,
  })
}

// 学生课中报告反馈(教师)
export function reportClassBack(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/reportClassBack',
    data,
  })
}

// 学生课后习题(教师)
export function afterClass(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/afterClass',
    data,
  })
}

// 学生课后习题完成率(教师)
export function afterClassCompletion(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/afterClassCompletion',
    data,
  })
}

// 学生课后习题反馈(教师)
export function afterClassBack(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/afterClassBack',
    data,
  })
}

// 学生课中操作步骤图(教师)
export function reportClassPic(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/reportClassPic',
    data,
  })
}

// 学生课中实验操作步骤图平均值(教师)
export function reportClassCompletionPic(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/reportClassCompletionPic',
    data,
  })
}

// 学生课中操作反馈(教师)
export function reportClassBackPic(data) {
  return request({
    method: 'post',
    url:
      '/teach/' +
      (roleMap[store.getters.getUserMsg.role_id] || 'statistical') +
      '/reportClassBackPic',
    data,
  })
}

// 评价统计
export function evaluation(data) {
  return request({
    method: 'post',
    url: '/teach/Evaluation/statistics',
    data,
  })
}
