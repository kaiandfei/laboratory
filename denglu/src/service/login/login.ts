import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'
import { ILoginForm } from './types'

export const loginServer = (loginForm: ILoginForm) => {
  return testRequest.post<IServerDataType>({
    url: 'swrcommon/Login/schoolLoginCheck',
    data: loginForm
  })
}
// 获取角色信息
export const getuserMsg = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/editFind',
    data
  })
}
// gengxin角色信息
export const updatauserMsg = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/updateUser',
    data
  })
}
// 获取验证码
export const getphoneCode = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'common/sendMsg/dosendMsg',
    data
  })
}
// 获取验证码
export const getphoneCodenoToken = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrcommon/SendMsg/updatePhoneDoSendMsg',
    data
  })
}
// 获取注册验证码
export const getMakeUserDoSendMsg = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrcommon/SendMsg/makeUserDoSendMsg',
    data
  })
}
// 系统注册
export const register = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/Save',
    data
  })
}
// 验证码修改密码
export const updatapswbyphone = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/updatepasswordbyphone',
    data
  })
}
// 手机号,验证码校验
export function checkphoneCode(data: any) {
  return testRequest.post<IServerDataType>({
    url: 'common/Captcha/checkphoneCode',
    method: 'post',
    data: data
  })
}
// 获取角色权限
export const getrolerule = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: '/swrserveadmin/Role/getRole',
    data
  })
}

// 获取登录二维码
export const getqrCode = () => {
  return testRequest.post<IServerDataType<any>>({
    url: '/swrcommon/Login/getWxLogin_qrcode'
  })
}
// 查询绑定信息
export const scanLoginUser = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: '/swrcommon/Login/webScanLoginUser',
    data
  })
}
// 获取学科列表

export const getSubject = () => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/subject/getSubject'
  })
}

// token有效期验证
export const tokenCheck = (data: { token: string }) => {
  return testRequest.post<IServerDataType>({
    url: 'swrcommon/Login/tokenCheck',
    data
  })
}

// token有效期验证
export const getIdentity = () => {
  return testRequest.post<IServerDataType>({
    url: '/common/Login/getRolebyToken'
  })
}

// token有效期验证
export const changeIdentity = (data: { role_id: number }) => {
  return testRequest.post<IServerDataType>({
    url: '/common/Login/changebyToken',
    data
  })
}

// 获取菜单 roof: 1基础 2教学 3仪器 4危化品
export const getMenu = (data: { roof: number }) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: 'swrserveadmin/AuthRule/getAuthRuleList',
    data
  })
}
//获取通知列表
export const noticeList = (data: any) => {
  return testRequest.post<IServerDataType<any>>({
    url: '/swrserve/Notice/getPageData',
    data
  })
}
export const findArea = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/findArea ',
    data: data
  })
}

export const getSchoolList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/findSchool',
    data: data
  })
}
export const getSchoolClass = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/findSchoolClass ',
    data: data
  })
}

export const seeCount = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserve/Notice/updateSeeCount',
    data
  })
}

// 获取学校年
export function findschoolyear(data: any) {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/YearTerm/findschoolyear',
    data
  })
}

// 获取学科
export const getSubjectTeach = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/subject/findSubject',
    data
  })
}
