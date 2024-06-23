import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/getPageData',
    data
  })
}
export const findStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/findStudent',
    data
  })
}
export const findClassStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/findClassStudent',
    data
  })
}
export const delStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/delete',
    data
  })
}
export const saveStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/save',
    data
  })
}

export const editStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/findStudent',
    data
  })
}

export const uplodeStudent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Student/saveexcelData',
    data
  })
}
