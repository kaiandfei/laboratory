import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getaccount = (data: { list_rows: number; page: number; school_id: number }) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/getPageData',
    data
  })
}

export const saveSchool = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/Save',
    data: data
  })
}

export const getSchoolPageData = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/getPageData ',
    data: data
  })
}

export const delSchool = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/delete ',
    data: data
  })
}

export const updataStatus = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/updateStatus ',
    data: data
  })
}

export const findArea = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/findArea ',
    data: data
  })
}
