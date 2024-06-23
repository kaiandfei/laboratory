import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

//查询注册审核列表
export const registerExamineList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/getPageData',
    data: data
  })
}
//一键通过
export const updateUserStatus = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/updateUserStatus',
    data: data
  })
}
// //一键拒绝
// export const oneRefuse = (data: any) => {
//   return testRequest.post<IServerDataType>({
//     url: '',
//     data: data
//   })
// }
// //通过
// export const pass = (data: any) => {
//   return testRequest.post<IServerDataType>({
//     url: '',
//     data: data
//   })
// }
// //拒绝
// export const refuse = (data: any) => {
//   return testRequest.post<IServerDataType>({
//     url: '',
//     data: data
//   })
// }
//删除组织大纲
export const delPic = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/serve/InstitutionalFramework/delete',
    data: data
  })
}
//创建组织大纲
export const save = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/serve/InstitutionalFramework/save',
    data: data
  })
}
//查询单条组织大纲
export const findInstitutionalFramework = () => {
  return testRequest.post<IServerDataType>({
    url: '/serve/InstitutionalFramework/findInstitutionalFramework',
  })
}
