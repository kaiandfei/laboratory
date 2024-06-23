import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getaccount = (data: { list_rows: number; page: number; school_id: number }) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/User/getPageData',
    data
  })
}

export const getAreaTree = (data:any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/findAreaTree',
    data: data
  })
}

export const getAreaPage = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/getPageData',
    data
  })
}

export const changeStandard = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/updateStandard ',
    data
  })
}

export const saveArea = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/Save',
    data: data
  })
}

export const agetAreaPageData = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/getAreaChildPage',
    data: data
  })
}

export const delArea = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/delete ',
    data: data
  })
}

export const updataStatus = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/updateStatus ',
    data: data
  })
}

export const findArea = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Area/findArea ',
    data: data
  })
}
