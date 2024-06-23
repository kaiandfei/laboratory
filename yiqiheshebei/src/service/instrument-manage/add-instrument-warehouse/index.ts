import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { AddWarehousingList, RequestData } from './types'
export const postAddInstrument = (data: AddWarehousingList) => {
  return myRequest.post<RootObject<RequestData>>({
    url: '/schooldvc/SchoolInstrument/instrumentNew',
    data
  })
}
