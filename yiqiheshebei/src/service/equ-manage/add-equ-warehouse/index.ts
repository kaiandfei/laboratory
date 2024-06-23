import { myRequest, BaseRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { addWarehousingList } from './types'

export const postAddEquList = (data: addWarehousingList) => {
  return myRequest.post<RootObject<addWarehousingList>>({
    url: '/schooldvc/SchoolEquipment/equipmentAdd',
    data
  })
}
export const units = () => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/Units/units'
  })
}

export const findSchoolUser = () => {
  return BaseRequest.post<RootObject<any>>({
    url: '/swrserveadmin/User/findschoolUser'
  })
}
