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
    url: 'swrserveadmin/subject/findSubject',
    data,
  })
}

// 获取
export function getClass(data) {
  return request({
    method: 'post',
    url: '/teach/ClassInfo/getClass',
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
    url: 'teach/expBook/laboratoryBySubject',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 获取教师
export function selectUser(data) {
  return request({
    method: 'post',
    url: 'swrserveadmin/User/selectUser',
    data,
  })
}

// 获取备注信息
export function getRemark(data) {
  return request({
    method: 'post',
    url: '/teach/Note/getInfo',
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
    url: '/swrserveadmin/AuthRule/getAuthRuleList',
    data,
  })
}

// 获取当前学期年月日
export function findschoolYearweek(data) {
  return requestBase({
    method: 'post',
    data,
    url: '/swrserveadmin/YearTerm/findschoolYearweek',
  })
}

// 获取学校年
export function findschoolyear(data) {
  return requestBase({
    method: 'post',
    data,
    url: '/swrserveadmin/YearTerm/findschoolyear',
  })
}
