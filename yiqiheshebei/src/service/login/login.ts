import { myRequest, BaseRequest } from '../token/index'
import { RootObject } from '../rootObject'
import { ILoginForm } from './types'

export const loginServer = (loginForm: ILoginForm) => {
  return BaseRequest.post<RootObject>({
    url: 'swrcommon/Login/loginCheck',
    data: loginForm
  })
}

// 获取学科列表
export const getSubject = () => {
  return myRequest.post<RootObject>({
    url: 'swrserveadmin/subject/findSubject'
  })
}

// 获取学校用户列表
export const getSchoolUser = (data: { role_id?: number }) => {
  return BaseRequest.post<RootObject<any[]>>({
    url: 'swrserveadmin/User/findschoolUser',
    data
  })
}

// 获取菜单 roof: 1基础 2教学 3仪器
export const getMenu = (data: { roof: number }) => {
  return BaseRequest.post<RootObject<any[]>>({
    url: 'swrserveadmin/AuthRule/getAuthRuleList',
    data
  })
}

// 获取管理员列表
export const getLabAdmin = () => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/Laboratory/laboratoryAdmin'
  })
}

// token有效期验证
export const tokenCheck = (data: { token: any }) => {
  return BaseRequest.post<RootObject>({
    url: 'swrcommon/Login/tokenCheck',
    data
  })
}

// 检验期初建账状态
export const accountStatus = (data: { type: number }) => {
  return myRequest.post<RootObject<number>>({
    url: 'schooldvc/SchoolAccounts/accountStatus',
    data
  })
}
export const currentStandLevel = () => {
  return myRequest.post<RootObject<number>>({
    url: '/schooldvc/LaboratorySummary/getCurrentStandLevel'
  })
}
