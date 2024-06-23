import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'
import { ILoginForm } from './types'

export const loginServer = (loginForm: ILoginForm) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Userlogin/in',
    data: loginForm
  })
}

// 获取学科列表

export const getSubject = () => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/subject/getSubject'
  })
}

// 获取用户
export const getSchoolUser = (data: { role_id: number | string }) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/findschoolUser',
    data
  })
}

// token有效期验证
export const tokenCheck = (data: { token: any }) => {
  return testRequest.post<IServerDataType>({
    url: 'swrcommon/Login/tokenCheck',
    data
  })
}

// 获取菜单 roof: 1基础 2教学 3仪器
export const getMenu = (data: { roof: number }) => {
  return testRequest.post<IServerDataType<any[]>>({
    url: 'swrserveadmin/AuthRule/getAuthRuleList',
    data
  })
}
