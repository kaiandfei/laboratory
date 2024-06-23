import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getSwrYear = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SwrYear/getPageData',
    data
  })
}
export const delSwrYear = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SwrYear/delete',
    data
  })
}
export const saveSwrYear = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolYear/createAllYearTerm',
    data
  })
}

export const getSchoolMsg = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolYear/Create',
    data
  })
}
export const getSchoolM = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/findSchool',
    data
  })
}
export const editSchoolM = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/editSchool',
    data
  })
}
export const upFile = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/OssImage/uploadImage',
    data
  })
}
