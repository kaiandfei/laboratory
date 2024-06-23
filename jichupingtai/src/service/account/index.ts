import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getaccount = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/getPageData',
    data: data
  })
}

export const getSchoolClass = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/findSchoolClass ',
    data: data
  })
}

export const getSchoolList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/findSchool',
    data: data
  })
}

export const saveSchoolAccount = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/Save',
    data: data
  })
}
//重置密码
export const updatemobilepassword = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/updatepasswordbygly',
    data: data
  })
}
// export const updatemobilepassword = (data: any) => {
//   return testRequest.get<IServerDataType>({
//     url: `/swrserveadmin/User/updatemobilepassword?id=${data.id}&oldpassword=${data.oldpassword}&password=${data.password}`,
//   })
// }

export const editUser = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/editFind',
    data: data
  })
}

export const delUser = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/delete',
    data: data
  })
}

export const rePsw = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/updatepassword',
    data: data
  })
}

export const uploadfile = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/saveexcelData',
    data: data
  })
}
export const uploadfileSchool = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/saveexcelDataSchool',
    data: data
  })
}

export const uploadSchool = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/School/saveexcelData',
    data: data
  })
}
export const exportUser = (data: any) => {
  return testRequest.get<IServerDataType>({
    url: '/swrserveadmin/User/exportUser',
    data: data
  })
}
export const findRoleUser = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/findRoleUser',
    data: data
  })
}
export const getUserBodyInfo = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/getUserBodyInfo',
    data: data
  })
}
export const deleteUserBodyInfo = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/deleteUserBodyInfo',
    data: data
  })
}
