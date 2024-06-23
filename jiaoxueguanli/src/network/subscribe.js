import { request } from './request'

// 根据教师获取班级
export function getClassByTeacher(data) {
  return request({
    method: 'post',
    url: 'teach/ClassInfo/getClassByTeacher',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 获取教师
export function selectSchoolClass(data) {
  return request({
    method: 'post',
    url: '/swrserveadmin/SchoolClass/selectSchoolClass',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 根据班级获取教师
export function getTeacherByClass(data) {
  return request({
    method: 'post',
    url: 'teach/ClassInfo/getTeacherByClass',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 根据实验获取仪器
export function getMaterialBook(data) {
  return request({
    method: 'post',
    url: 'teach/Material/getMaterialBook',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 实验预约，登记修改
export function expBookNew(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBookNew',
    data,
  })
}

//
export function expBookEditNew(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBookEditNew',
    data,
  })
}

// 修改备课
export function expBookLesson(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBookLesson',
    data,
  })
}

// 参考课表
export function findSection(data) {
  return request({
    method: 'post',
    url: '/teach/TeacherSection/findSection',
    data,
  })
}

// 编辑参考课表
export function saveSection(data) {
  return request({
    method: 'post',
    url: '/teach/TeacherSection/Save',
    data,
  })
}

// 实验室预约表格数据
export function labExpDate(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBooklist',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 实验室预约列表（管理员）
export function allLabExpDate(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/allExpBook',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 我的预约
export function mySubList(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/myBookList',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 本学期实验计划
export function getExpPlan(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expPlanDetail',
    data,
    // params: {
    //   groupId: data
    // }
  })
}
// 我的实验计划
export function getMyPlan(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/myExp',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 提交预约
export function pushSub(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/expBook',
    data,
    // params: {
    //   groupId: data
    // }
  })
}

// 取消预约
export function cancelExpBook(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/cancelExpBook',
    data,
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

// 撤销（删除）预约
export function delExpBook(data) {
  return request({
    method: 'post',
    url: '/teach/expBook/delExpBook',
    data,
  })
}
