import { hcRequest } from '../token/index'
import { IServerDataType } from '../token/types'

// 实验室建设情况
export const labApi = (data: any) => {
  return hcRequest.post<IServerDataType>({
    url: 'school/TotalSummary/subjectLaborSummary',
    data
  })
}

// 师资配备
export const teacherApi = (data: any) => {
  return hcRequest.post<IServerDataType>({
    url: 'school/TotalSummary/teacherSummary',
    data
  })
}
