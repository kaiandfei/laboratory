import { request } from '../network/request'
//获取设备位置信息
export const getDevicePosition = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/DeviceController/getDevicePosition',
    data,
  })
//获取设备使用数据
export const getDeviceUseData = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/DeviceController/getDeviceUseData',
    data,
  })
//获取实验室预约
export const getLabBook = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/ElectronicCardController/getLabBook',
    // url: '/school/GoClass/getLabBook',
    data,
  })
// 实验室预约表格数据
export const expBooklist = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/ElectronicCardController/expBooklist',
    data,
  })

//添加人脸
export const addFace = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/FaceController/addFace',
    data,
  })
//添加人脸
export const reAddFace = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/FaceController/reAddFace',
    data,
  })
//人脸识别
export const searchFace = (data) =>
  request({
    method: 'post',
    url: '/swrperipheral/FaceController/searchFace',
    data,
  })
// 获取实验室注意事项
export function noticeList(data) {
  return request({
    method: 'get',
    url: `/school_dev/laboratory/noticeList?labor_id=${data.labor_id}`,
  })
}
// 我的实验计划
export function getMyPlan(data) {
  return request({
    method: 'post',
    url: 'teach/expBook/myExp',
    data,
  })
}
// 根据实验获取仪器
export function getMaterialBook(data) {
  return request({
    method: 'post',
    url: 'teach/Material/getMaterialBook',
    data,
  })
}
// 实验方案查询
export function ExpMaterialFind(data) {
  return request({
    method: 'post',
    url: 'teach/Material/find',
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
// 学期管理 查询
export function findDatebyweek(data) {
  return request({
    method: 'post',
    data,
    url: '/swrperipheral/ElectronicCardController/findDatebyweek',
  })
}
// 上传图片接口
export function uploadImage(data) {
  return request({
    method: 'post',
    data,
    url: '/swrperipheral/ElectronicCardController/uploadImage',
  })
}
// 根据班级获取教师
export function getTeacherByClass(data) {
  return request({
    method: 'post',
    url: 'teach/ClassInfo/getTeacherByClass',
    data,
  })
}
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
// 参考课表
export function findSection(data) {
  return request({
    method: 'post',
    url: '/teach/TeacherSection/findSection',
    data,
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
// 获取计划
export function getPlan(data) {
  return request({
    method: 'post',
    url: '/teach/statistical/getPlan',
    data,
  })
}
export function planDetailExp(data) {
  return request({
    method: 'post',
    url: '/teach/expPlan/planDetailExp',
    data,
  })
}
//签到
export function sign(data) {
  return request({
    method: 'post',
    url: '/terminal/ExpBook/sign',
    data,
  })
}
//签退
export function endSign(data) {
  return request({
    method: 'post',
    url: '/swrperipheral/ElectronicCardController/endSign',
    data,
  })
}
export function getCameraVideoRealTime(data) {
  return request({
    method: 'get',
    url: `/swrperipheral/ElectronicCardController/getCameraVideoRealTime?lab_id=${data.lab_id}&type=${data.type}`,
  })
}

// 获取当前学期年月日
export function findschoolYearweek(data) {
  return request({
    method: 'post',
    data,
    url: '/swrserveadmin/YearTerm/findschoolYearweek',
  })
}
export function findTypeClassCardSetting(data) {
  return request({
    method: 'post',
    data,
    url: '/peripheral/DeviceController/findSchoolTypeClassCardSetting',
  })
}
//获取通知列表
export function messageList(data) {
  return request({
    method: 'post',
    data,
    url: '/swrserve/Notice/getPageData',
  })
}
