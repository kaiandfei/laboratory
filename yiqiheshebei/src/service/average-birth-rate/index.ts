import { myRequest } from '../token/index'
import { RootObject } from '../rootObject'


export const getTableData = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/RailStudentAvgStandard/getList',
    data
  })
}
export const saveTableData = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/RailStudentAvgStandard/save',
    data
  })
}
