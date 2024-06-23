import { request, requestBase } from './request'

// 登录
export function login(data) {
  return requestBase({
    method: 'post',
    url: 'swrcommon/Login/loginCheck',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// token有效期验证
export const tokenCheck = (data) => {
  return requestBase({
    method: 'post',
    url: 'swrcommon/Login/tokenCheck',
    data,
  })
}

// 获取学科
export const getSubject = (data) => {
  return requestBase({
    method: 'post',
    url: 'school/subject/findSubject',
    data,
  })
}

// 获取实验室
export function getClass(data) {
  return request({
    method: 'post',
    url: '/school/ClassInfo/getClass',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 获取实验室
export function laboratoryBySubject(data) {
  return request({
    method: 'post',
    url: 'school/expBook/laboratoryBySubject',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 获取备注信息
export function getRemark(data) {
  return request({
    method: 'post',
    url: '/school/Note/getInfo',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 获取菜单
export function getMenu(data) {
  return requestBase({
    method: 'post',
    url: '/school/AuthRule/getAuthRuleList',
    data,
  })
}

// 获取当前学期年月日
export function findschoolYearweek(data) {
  return requestBase({
    method: 'post',
    data,
    url: '/school/YearTerm/findschoolYearweek',
  })
}

// 获取学校年
export function findschoolyear(data) {
  return requestBase({
    method: 'post',
    data,
    url: '/school/YearTerm/findschoolyear',
  })
}

// 获取当前时间及周次
export function getDatebyweek(data) {
  return request({
    method: 'post',
    data,
    url: '/teach/YearTerm/findDatebyweek',
  })
}
