import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getGradeClass = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/School/findSchoolClass',
    data
  })
}
export const getSchoolGradeClass = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolClass/findSchoolClass',
    data
  })
}
export const getClassData = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolClass/getPageData',
    data
  })
}

export const addGradeApi = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Grade/Save',
    data
  })
}

export const addClassApi = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolClass/SaveAll',
    data
  })
}
export const delGradeApi = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Grade/delete',
    data
  })
}

export const delClassApi = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolClass/delete',
    data
  })
}

export const saveClassApi = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolClass/Save',
    data
  })
}
export const saveSchoolYear = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolYear/Save',
    data
  })
}

export const schoolYearList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolYear/getPageData',
    data
  })
}

export const schoolYearDel = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/SchoolYear/delete',
    data
  })
}
