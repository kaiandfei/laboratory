import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  damageRegistrationList,
  instrumnetList,
  addDamageRegistrationList,
  instrumentDetailList,
  compensateInfoList,
  instrumentRegistrationList
} from './types'

//获取设备损坏、赔偿登记情况
export const getDamageRegistrationList = (data: { keyword: string; page: number }) => {
  return myRequest.post<RootObject<damageRegistrationList>>({
    url: '/schooldvc/SchoolEquipmentDamage/equipmentDamageList',
    data
  })
}

// 获取搜索到的设备信息
export const getInstrumentInfo = (data: { keyword: string }) => {
  return myRequest.post<RootObject<instrumnetList[]>>({
    url: '/schooldvc/SchoolEquipmentLend/schoolEquipment',
    data
  })
}

// 获取学校教师信息列表
export const getTeacherList = (data: { id: number }) => {
  return myRequest.post<RootObject<any[]>>({
    url: '/schooldvc/User/teacherList',
    data
  })
}

// 提交新增的设备损坏、赔偿信息
export const addEquDamage = (data: addDamageRegistrationList) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/SchoolEquipmentDamage/schoolEquipmentAdd',
    data
  })
}

// 获取设备损坏、赔偿详情信息
export const getInstrumentDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<instrumentDetailList>>({
    url: '/schooldvc/SchoolEquipmentDamage/damageListing',
    data
  })
}

//删除设备列表信息
export const deleteDamageList = (data: { id: number }) => {
  return myRequest.post<RootObject<instrumentDetailList>>({
    url: '/schooldvc/SchoolEquipmentDamage/delDamageList',
    data
  })
}

//提交赔偿登记信息
export const postCompensateInfo = (data: compensateInfoList) => {
  return myRequest.post<RootObject<compensateInfoList>>({
    url: '/schooldvc/SchoolEquipmentDamage/damageCompensation',
    data
  })
}

// 仪器登记总览（仪器损耗、赔偿情况）
export const getInstrumentRegistrationOverview = (data: { keyword: string; page: number; status: any }) => {
  return myRequest.post<RootObject<instrumentRegistrationList>>({
    url: '/schooldvc/SchoolEquipmentDamage/equipmentRegistration',
    data
  })
}
